package com.example.aplicacionmovilvoluntaridado.models;

import com.google.gson.annotations.SerializedName;

public class EntidadActividad {
    @SerializedName("id_entidad")
    private int idEntidad;
    private String cif;
    private String nombre;
    @SerializedName("nombre_responsable")
    private String nombreResponsable;
    @SerializedName("apellidos_responsable")
    private String apellidosResponsable;
    @SerializedName("contact_mail")
    private String contactMail;
    @SerializedName("perfil_url")
    private String perfilUrl;

    // Getters and Setters
    public int getIdEntidad() {
        return idEntidad;
    }

    public void setIdEntidad(int idEntidad) {
        this.idEntidad = idEntidad;
    }

    public String getCif() {
        return cif;
    }

    public void setCif(String cif) {
        this.cif = cif;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getNombreResponsable() {
        return nombreResponsable;
    }

    public void setNombreResponsable(String nombreResponsable) {
        this.nombreResponsable = nombreResponsable;
    }

    public String getApellidosResponsable() {
        return apellidosResponsable;
    }

    public void setApellidosResponsable(String apellidosResponsable) {
        this.apellidosResponsable = apellidosResponsable;
    }

    public String getContactMail() {
        return contactMail;
    }

    public void setContactMail(String contactMail) {
        this.contactMail = contactMail;
    }

    public String getPerfilUrl() {
        return perfilUrl;
    }

    public void setPerfilUrl(String perfilUrl) {
        this.perfilUrl = perfilUrl;
    }
}
