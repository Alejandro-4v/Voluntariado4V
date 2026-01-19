package com.example.aplicacionmovilvoluntaridado.models;

import java.io.Serializable;
import com.google.gson.annotations.SerializedName;

public class Entidad implements Serializable {
    @SerializedName("idEntidad")
    private int idEntidad;
    private String nombre;
    private String cif;
    @SerializedName("nombreResponsable")
    private String nombreResponsable;
    @SerializedName("apellidosResponsable")
    private String apellidosResponsable;
    @SerializedName("contactMail")
    private String contactMail;
    @SerializedName("perfilUrl")
    private String perfilUrl;

    public int getIdEntidad() { return idEntidad; }
    public void setIdEntidad(int idEntidad) { this.idEntidad = idEntidad; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getCif() { return cif; }
    public void setCif(String cif) { this.cif = cif; }

    public String getNombreResponsable() { return nombreResponsable; }
    public void setNombreResponsable(String nombreResponsable) { this.nombreResponsable = nombreResponsable; }

    public String getApellidosResponsable() { return apellidosResponsable; }
    public void setApellidosResponsable(String apellidosResponsable) { this.apellidosResponsable = apellidosResponsable; }

    public String getContactMail() { return contactMail; }
    public void setContactMail(String contactMail) { this.contactMail = contactMail; }

    public String getPerfilUrl() { return perfilUrl; }
    public void setPerfilUrl(String perfilUrl) { this.perfilUrl = perfilUrl; }
}
