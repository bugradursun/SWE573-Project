package com.example.ConnectTheDotsApi.user;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.security.Principal;
import java.time.LocalDate;
import java.util.Collection;


@Getter // olusturdugumuz değişkenler için builtin getter method
@Setter // oluşturdugumuz değişkenler için builtin setter method
@Builder // builder pattern tasarım deseni ile 'new' keyword kullanmadan nesne oluşturmamızı sağlar
@AllArgsConstructor // tum degiskenleri icere bir constructor uretir
@NoArgsConstructor // parametresiz constructor uretir
@Entity //bu sınıfın veritabanında bir tabloya karsılık geldigini belirtir
@Table(name = "user")
@EntityListeners((AuditingEntityListener.class)) //@CreatedDate, @LastmofiedDate gibi otomatik zaman damgaları eklemek için
public class User implements UserDetails, Principal {
    @Id
    @GeneratedValue
    private Integer id;
    private String firstname;
    private String lastname;
    private LocalDate dateOfBirth;
    @Column(unique = true)
    private String email;
    private String password;
    private String job;
    private boolean accountLocked;
    private boolean enabled;


    @Override
    public String getName() {
        return email;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return null;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return UserDetails.super.isAccountNonExpired();
    }

    @Override
    public boolean isAccountNonLocked() {
        return UserDetails.super.isAccountNonLocked();
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return UserDetails.super.isCredentialsNonExpired();
    }

    @Override
    public boolean isEnabled() {
        return UserDetails.super.isEnabled();
    }
}
