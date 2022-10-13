package ru.kata.spring.boot_security.demo.init;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;
import ru.kata.spring.boot_security.demo.models.Role;
import ru.kata.spring.boot_security.demo.models.User;
import ru.kata.spring.boot_security.demo.service.RoleService;
import ru.kata.spring.boot_security.demo.service.UserService;

import javax.annotation.PostConstruct;
import java.util.HashSet;
import java.util.Set;

public class InitUsers {
    private final UserService userService;
    private final RoleService roleService;

    @Autowired
    public InitUsers(UserService userService, RoleService roleService) {
        this.userService = userService;
        this.roleService = roleService;
    }


    @PostConstruct
    public void addUsersToDb() {

        Role roleAdmin = new Role("ROLE_ADMIN");
        Role roleUser = new Role("ROLE_USER");


        roleService.add(roleAdmin);
        roleService.add(roleUser);

        User userAdmin = new User("Admin", "Adminov",
                "admin@mail.ru", 24,
                new BCryptPasswordEncoder().encode("admin"));

        User userUser = new User("User", "Userov",
                "user@mail.ru", 24,
                new BCryptPasswordEncoder().encode("user"));

        userAdmin.setRoles(new HashSet<>(Set.of(roleAdmin)));
        userUser.setRoles(new HashSet<>(Set.of(roleUser)));


        userService.saveUser(userAdmin, "ROLE_ADMIN");
        userService.saveUser(userUser, "ROLE_USER");


    }


}
