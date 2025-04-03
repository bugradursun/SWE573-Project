package com.example.ConnectTheDotsApi.auth;

import com.example.ConnectTheDotsApi.email.EmailService;
import com.example.ConnectTheDotsApi.email.EmailTemplateName;
import com.example.ConnectTheDotsApi.role.RoleRepository;
import com.example.ConnectTheDotsApi.user.Token;
import com.example.ConnectTheDotsApi.user.TokenRepository;
import com.example.ConnectTheDotsApi.user.User;
import com.example.ConnectTheDotsApi.user.UserRepository;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.List;

@Service // marks the class as a service layer, the main business logic is in this class
@RequiredArgsConstructor //for 'final' variables (to inject them)
public class AuthenticationService {

    private final RoleRepository roleRepository; // bunu final olarak işaretledigimiz icin @RequiredArgsConstructor ile constructor oluşturulur ve DI yapılmıs olur
    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final TokenRepository tokenRepository;
    private final EmailService emailService;
    @Value("${application.mailing.frontend.activation-url}")
    private String activationUrl;

    public void register(RegistrationRequest request) throws MessagingException {
        var userRole = roleRepository.findByName("USER")
                .orElseThrow(() -> new IllegalStateException("ROLE USER was not initialized"));

        // create the user from the request
        var user = User.builder()
                .firstname(request.getFirstname())
                .lastname(request.getLastname())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .accountLocked(false)
                .enabled(false)
                .roles(List.of(userRole))
                .build();

        // save it to user table in db
        userRepository.save(user);
        //send validation email
        sendValidationEmail(user);

    }

    private void sendValidationEmail(User user) throws MessagingException {
        var newToken = generateAndSaveActivationToken(user);
        // send email

        emailService.sendEmail(
                user.getEmail(),
                user.fullName(),
                EmailTemplateName.ACTIVATE_ACCOUNT,
                activationUrl,
                newToken,
                "Account Activation"
        );;

    }

    private String generateAndSaveActivationToken(User user) {
        //generate a token
        String generatedToken = generateActivationCode(6);
        var token = Token.builder()
                .token(generatedToken)
                .createdAt(LocalDateTime.now())
                .expiresAt(LocalDateTime.now().plusMinutes(15)) // expires in 15 minutes
                .user(user)
                .build();

        tokenRepository.save(token);
        return generatedToken;

    }

    //generate an activation code with given length
    private String generateActivationCode(int length) {
        String characters = "0123456789"; // token will be composed of these characters (it will only contain integers
        StringBuilder codeBuilder = new StringBuilder();
        SecureRandom secureRandom = new SecureRandom();
        for ( int i = 0;i<length;i++) {
            int randomIndex = secureRandom.nextInt(characters.length());
            codeBuilder.append(characters.charAt(randomIndex));
        }

        return codeBuilder.toString();
    }
}
