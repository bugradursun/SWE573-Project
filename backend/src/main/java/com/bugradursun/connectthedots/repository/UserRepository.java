package com.bugradursun.connectthedots.repository;

import com.bugradursun.connectthedots.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> { //JPA repository CRUD islemlerini otomatik saglayan bir classtır.
    // JpaRepository sagladıgı methodlar sayesinde User entitysi uzerinde islemler yapmaya olanak saglar
    Optional<User> findByUsername(String username);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
}
