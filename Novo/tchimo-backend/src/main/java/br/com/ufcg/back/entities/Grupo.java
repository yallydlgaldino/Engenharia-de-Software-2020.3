package br.com.ufcg.back.entities;

import br.com.ufcg.back.exceptions.user.UserAlreadyExistException;
import br.com.ufcg.back.exceptions.user.UserNotFoundException;
import com.fasterxml.jackson.annotation.JsonCreator;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

@Entity
public class Grupo {

    @Id
    @GeneratedValue
    private Long idGroup;

    private String emailManager;

    private ArrayList<Long> memberIDs = new ArrayList<>();

    private int numberFoMembersPermitted = 0;

    @JsonCreator
    public Grupo(String emailManager, long idManager) {

        super();

        this.emailManager = emailManager;
        memberIDs.add(idManager);
    }

    @JsonCreator
    public Grupo() {
        super();
    }

    public String getEmailManager() {
        return emailManager;
    }

    public void setEmailManager(String emailManager) {
        this.emailManager = emailManager;
    }

    public Long getIdGroup(){
        return idGroup;
    }

    public void setIdGroup(Long idGroup) {
        this.idGroup = idGroup;
    }

    public int amountOfMembers(){
        return memberIDs.size();
    }

    public List<Long> getMemberIDs() {
        return memberIDs;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Grupo grupo = (Grupo) o;
        return emailManager.equals(grupo.emailManager) &&
                memberIDs.equals(grupo.memberIDs);
    }

    @Override
    public int hashCode() {
        return Objects.hash(idGroup);
    }
    public int getNumberFoMembersPermitted() {
        return numberFoMembersPermitted;
    }

    public void setNumberFoMembersPermitted(int numberFoMembersPermitted) {
        this.numberFoMembersPermitted = numberFoMembersPermitted;
    }

    public int getNumberOfMembers() {
        return memberIDs.size();
    }

    public boolean usuarioParticipa(long idUser) {
        if(memberIDs.contains(idUser))
            return true;
        return false;
    }

    public void removeUsuario(Long usrId) {
        memberIDs.remove(usrId);
    }

    public void addUser(Long usrId) throws UserAlreadyExistException {
        if (memberIDs.contains(usrId))
            throw new UserAlreadyExistException("Usuario já pertence ao grupo!");
        else memberIDs.add(usrId);
    }

    public void removeUser(Long usrId) throws UserNotFoundException {
        if (memberIDs.contains(usrId))
            memberIDs.remove(usrId);
        else throw new UserNotFoundException("Usuario não foi encontrado na turma!");
    }
}
