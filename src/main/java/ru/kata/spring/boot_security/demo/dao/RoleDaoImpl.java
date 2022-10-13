package ru.kata.spring.boot_security.demo.dao;

import org.springframework.stereotype.Repository;
import ru.kata.spring.boot_security.demo.models.Role;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.Collection;
import java.util.HashSet;

@Repository
public class RoleDaoImpl implements RoleDao{
    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public void add(Role role) {
        entityManager.persist(role);
    }

    @Override
    public Collection<Role> getAll() {
        return new HashSet<>(entityManager.createQuery("SELECT role FROM Role role", Role.class)
                .getResultList());
    }

    @Override
    public void delete(Long id) {
        entityManager.remove(getById(id));
    }

    @Override
    public Role getById(Long id) {
        return entityManager.find(Role.class, id);
    }

    @Override
    public Role getRoleByName(String input_role) {
        return entityManager.createQuery("SELECT role FROM Role role WHERE role.name=:name", Role.class)
                .setParameter("name", input_role).getSingleResult();
    }
}
