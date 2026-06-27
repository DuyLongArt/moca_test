package com.moca.platform;

public record LoginResponse(String accessToken, AuthUserDto user) {
}
