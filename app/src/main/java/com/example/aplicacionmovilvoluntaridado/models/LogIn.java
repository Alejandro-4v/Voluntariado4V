package com.example.aplicacionmovilvoluntaridado.models;

public class LogIn {
    private String loginMail;
    private String password;

    public LogIn(String loginMail, String password) {
        this.loginMail = loginMail;
        this.password = password;
    }

    public String getLoginMail() {
        return loginMail;
    }

    public void setLoginMail(String loginMail) {
        this.loginMail = loginMail;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
