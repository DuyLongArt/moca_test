package com.moca.platform;

import com.moca.platform.DataLayer.protocol.UserEntity;
import com.moca.platform.DataLayer.protocol.UserRole;
import java.util.UUID;

public record AuthUserDto(UUID id, String email, String fullName, UserRole role) {

    static AuthUserDto from(UserEntity user) {
        return new AuthUserDto(user.getId(), user.getEmail(), user.getFullName(), user.getRole());
    }
}
