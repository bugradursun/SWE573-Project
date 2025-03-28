package com.example.ConnectTheDotsApi.auth;

import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


//General note about the MVC
//Controller => Service => Repository => DB
// In order to do that we inject(DI) to prev state.
// For example we inject service layer from controller in order to go from controller to service
@RestController
@RequestMapping("auth")
@RequiredArgsConstructor
@Tag(name="Authentication")
public class AuthenticationController {

    @Autowired
    @NonNull
    private final AuthenticationService service;

    @PostMapping("/register") //define the route
    @ResponseStatus(HttpStatus.ACCEPTED)
    public ResponseEntity<?> register (
            @RequestBody @Valid RegistrationRequest request
    ) {
        service.register(request); // call the service
        return ResponseEntity.accepted().build();
    }

}
