package com.example.ConnectTheDotsApi.role;

import com.example.ConnectTheDotsApi.user.User;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.List;

@Getter // builtin getter
@Setter // builtin setter
@Builder // builder pattern tasarım deseni ile 'new' keyword kullanmadan nesne oluşturmamızı sağlar
@AllArgsConstructor
@NoArgsConstructor
@Entity
@EntityListeners((AuditingEntityListener.class)) //@CreatedDate, @LastmofiedDate gibi otomatik zaman damgaları eklemek için
public class Role {

    @Id
    @GeneratedValue
    private Integer id;
    @Column(unique = true)
    private String  name;

    @ManyToMany(mappedBy = "roles") //role ve user arasında many to many iliski var
    @JsonIgnore
    private List<User> users;

    @CreatedDate
    @Column(nullable = false,updatable = false)
    private LocalDateTime createdDate;
    @LastModifiedDate
    @Column(insertable = false)
    private LocalDateTime lastModifiedDate;

    public String getName() {
        return name;
    }
}
