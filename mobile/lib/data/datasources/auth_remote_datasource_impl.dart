import '../../core/constants/api_endpoints.dart';
import '../../core/network/api_client.dart';
import '../../core/storage/token_storage.dart';
import '../../shared/models/user_model.dart';
import 'auth_remote_datasource.dart';

class ApiAuthRemoteDataSource implements AuthRemoteDataSource {
  @override
  Future<UserModel?> fetchCurrentUser() async {
    try {
      final token = await TokenStorage.getToken();
      if (token == null || token.isEmpty) return null;

      final res = await ApiClient.get(ApiEndpoints.me);
      if (res != null) {
        final userData = (res is Map && res.containsKey('user')) ? res['user'] : res;
        return UserModel.fromJson(userData as Map<String, dynamic>);
      }
      return null;
    } catch (_) {
      return null;
    }
  }

  @override
  Future<UserModel> loginUser(String emailOrPhone, String password, UserRole role) async {
    final res = await ApiClient.post(
      ApiEndpoints.login,
      body: {
        'emailOrPhone': emailOrPhone,
        'password': password,
      },
      requireAuth: false,
    );

    if (res != null) {
      final token = res['token'] ?? (res is Map && res.containsKey('tokens') ? (res['tokens'] as Map)['accessToken'] : null);
      final userData = res['user'] ?? res;
      if (token != null && userData != null) {
        await TokenStorage.saveToken(token as String);
        final user = UserModel.fromJson(userData as Map<String, dynamic>);
        await TokenStorage.saveUserRole(user.role.code);
        return user;
      }
    }
    throw ApiException('Failed to parse login response');
  }

  @override
  Future<UserModel> registerUser({
    required String name,
    required String email,
    required String phone,
    required String password,
    required UserRole role,
  }) async {
    final res = await ApiClient.post(
      ApiEndpoints.register,
      body: {
        'name': name,
        'email': email,
        'phone': phone,
        'password': password,
        'roles': [role.code],
      },
      requireAuth: false,
    );

    if (res != null) {
      final token = res['token'] ?? (res is Map && res.containsKey('tokens') ? (res['tokens'] as Map)['accessToken'] : null);
      final userData = res['user'] ?? res;
      if (token != null && userData != null) {
        await TokenStorage.saveToken(token as String);
        final user = UserModel.fromJson(userData as Map<String, dynamic>);
        await TokenStorage.saveUserRole(user.role.code);
        return user;
      }
    }
    throw ApiException('Failed to parse registration response');
  }

  @override
  Future<void> logoutUser() async {
    try {
      await ApiClient.post(ApiEndpoints.logout);
    } catch (_) {}
    await TokenStorage.clearAll();
  }
}
