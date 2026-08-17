enum UserRole {
  renter,
  owner,
  buyer,
  admin,
}

extension UserRoleExtension on UserRole {
  String get displayName {
    switch (this) {
      case UserRole.renter:
        return 'Renter';
      case UserRole.owner:
        return 'Property Owner';
      case UserRole.buyer:
        return 'Buyer';
      case UserRole.admin:
        return 'Admin';
    }
  }

  String get code {
    switch (this) {
      case UserRole.renter:
        return 'RENTER';
      case UserRole.owner:
        return 'OWNER';
      case UserRole.buyer:
        return 'BUYER';
      case UserRole.admin:
        return 'ADMIN';
    }
  }

  static UserRole fromCode(String code) {
    switch (code.toUpperCase()) {
      case 'OWNER':
        return UserRole.owner;
      case 'BUYER':
        return UserRole.buyer;
      case 'ADMIN':
        return UserRole.admin;
      default:
        return UserRole.renter;
    }
  }
}

class UserModel {
  final String id;
  final String name;
  final String email;
  final String phone;
  final List<UserRole> roles;
  final String? avatarUrl;
  final bool isVerified;
  final bool isIdentityVerified;
  final double rating;
  final int totalListings;
  final DateTime createdAt;

  UserModel({
    required this.id,
    required this.name,
    required this.email,
    required this.phone,
    required this.roles,
    this.avatarUrl,
    this.isVerified = false,
    this.isIdentityVerified = false,
    this.rating = 4.8,
    this.totalListings = 0,
    DateTime? createdAt,
  }) : createdAt = createdAt ?? DateTime.now();

  UserRole get role => roles.isNotEmpty ? roles.first : UserRole.renter;

  bool get isOwner => roles.contains(UserRole.owner);
  bool get isRenter => roles.contains(UserRole.renter);
  bool get isBuyer => roles.contains(UserRole.buyer);
  bool get isAdmin => roles.contains(UserRole.admin);

  UserModel copyWith({
    String? id,
    String? name,
    String? email,
    String? phone,
    List<UserRole>? roles,
    String? avatarUrl,
    bool? isVerified,
    bool? isIdentityVerified,
    double? rating,
    int? totalListings,
  }) {
    return UserModel(
      id: id ?? this.id,
      name: name ?? this.name,
      email: email ?? this.email,
      phone: phone ?? this.phone,
      roles: roles ?? this.roles,
      avatarUrl: avatarUrl ?? this.avatarUrl,
      isVerified: isVerified ?? this.isVerified,
      isIdentityVerified: isIdentityVerified ?? this.isIdentityVerified,
      rating: rating ?? this.rating,
      totalListings: totalListings ?? this.totalListings,
      createdAt: createdAt,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'email': email,
      'phone': phone,
      'roles': roles.map((r) => r.code).toList(),
      'avatarUrl': avatarUrl,
      'isVerified': isVerified,
      'isIdentityVerified': isIdentityVerified,
      'rating': rating,
      'totalListings': totalListings,
      'createdAt': createdAt.toIso8601String(),
    };
  }

  factory UserModel.fromJson(Map<String, dynamic> json) {
    List<UserRole> parsedRoles = [];
    final rawRoles = json['roles'];
    final rawRole = json['role'];
    if (rawRoles is List && rawRoles.isNotEmpty) {
      parsedRoles = rawRoles.map((r) => UserRoleExtension.fromCode(r.toString())).toList();
    } else if (rawRole is String && rawRole.isNotEmpty) {
      parsedRoles = [UserRoleExtension.fromCode(rawRole)];
    } else {
      parsedRoles = [UserRole.renter];
    }

    return UserModel(
      id: json['id']?.toString() ?? '',
      name: json['name']?.toString() ?? '',
      email: json['email']?.toString() ?? '',
      phone: json['phone']?.toString() ?? '',
      roles: parsedRoles,
      avatarUrl: json['avatarUrl'] as String?,
      isVerified: json['isPhoneVerified'] as bool? ?? json['isVerified'] as bool? ?? false,
      isIdentityVerified: json['isIdentityVerified'] as bool? ?? false,
      rating: (json['rating'] as num?)?.toDouble() ?? 4.8,
      totalListings: json['totalListings'] as int? ?? 0,
      createdAt: json['createdAt'] != null
          ? DateTime.tryParse(json['createdAt'].toString()) ?? DateTime.now()
          : DateTime.now(),
    );
  }
}
