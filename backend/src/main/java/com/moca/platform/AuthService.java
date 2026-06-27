package com.moca.platform;

import com.moca.platform.DataLayer.protocol.UserEntity;
import com.moca.platform.DataLayer.protocol.UserRepository;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthService {

    private final UserRepository users;


    public AuthService(UserRepository users) {
        this.users = users;

    }

    public LoginResponse login(String phoneNumber) {
        UserEntity user = users.findByPhoneNumber(phoneNumber.trim())
                .orElseGet(()->{
                        UserEntity newUser= new UserEntity(null, phoneNumber, phoneNumber, null, phoneNumber, null, phoneNumber, null, null, null);
                users.save(newUser);
                return newUser;
                });
                
                
      
        if (!user.getPhoneNumber().matches(phoneNumber)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Số điện thoại không đúng");
        }
        String accessToken = UUID.randomUUID().toString();
        
        return new LoginResponse(accessToken, AuthUserDto.from(user));
    }
}
