package ru.kata.spring.boot_security.demo.service;


import ru.kata.spring.boot_security.demo.models.User;

import java.util.List;

public interface UserService {
    List<User> listUsers();

    void saveUser(User user);
    void deleteUser(Long id);

    void updateUser( User user);
    User getUser(Long id);

    User showByUserName(String username);

}
