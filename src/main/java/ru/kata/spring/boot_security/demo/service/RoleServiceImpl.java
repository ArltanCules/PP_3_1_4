package ru.kata.spring.boot_security.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.kata.spring.boot_security.demo.dao.RoleDao;
import ru.kata.spring.boot_security.demo.models.Role;

import java.util.Collection;

@Service
public class RoleServiceImpl implements RoleService {
    private final RoleDao roleDao;

    @Autowired
    public RoleServiceImpl( RoleDao roleDao) {
        this.roleDao = roleDao;
    }

    @Transactional
    @Override
    public void add(Role role) {
        roleDao.add(role);
    }

    @Override
    public Collection<Role> getAll() {
        return roleDao.getAll();
    }

    @Transactional
    @Override
    public void delete(Long id) {
        roleDao.delete(id);
    }

    @Override
    public Role getById(Long id) {
        return roleDao.getById(id);
    }

    @Override
    public Role getRoleByName(String input_role) {
        return roleDao.getRoleByName(input_role);
    }

}
