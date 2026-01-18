package com.example.aplicacionmovilvoluntaridado;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import com.example.aplicacionmovilvoluntaridado.models.LogIn;
import com.example.aplicacionmovilvoluntaridado.models.Token;
import com.example.aplicacionmovilvoluntaridado.network.ApiClient;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class LoginActivity extends AppCompatActivity {

    private EditText etEmail, etPassword;
    private Button btnLogin;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);

        // 1. Inicializar vistas
        etEmail = findViewById(R.id.etEmail);
        etPassword = findViewById(R.id.etPassword);
        btnLogin = findViewById(R.id.btnLogin);

        // 2. Programar el botón
        btnLogin.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                String email = etEmail.getText().toString().trim();
                String password = etPassword.getText().toString().trim();

                if (email.isEmpty() || password.isEmpty()) {
                    Toast.makeText(LoginActivity.this, "Rellena todos los campos", Toast.LENGTH_SHORT).show();
                } else {
                    loginConAPI(email, password);
                }
            }
        });
    }

    private void loginConAPI(String email, String password) {
        // Creamos el objeto con los datos de login
        LogIn loginData = new LogIn(email, password);

        // Realizamos la llamada asíncrona
        ApiClient.getApiService().login(loginData, "voluntario").enqueue(new Callback<Token>() {
            @Override
            public void onResponse(Call<Token> call, Response<Token> response) {
                if (response.isSuccessful() && response.body() != null) {
                    // Si el login es correcto, recibimos el token y el usuario
                    Token tokenResponse = response.body();
                    String token = tokenResponse.getToken();
                    com.example.aplicacionmovilvoluntaridado.models.User user = tokenResponse.getUser();

                    // Guardar token en SharedPreferences para futuras peticiones
                    android.content.SharedPreferences.Editor editor = getSharedPreferences("VoluntariadoPrefs",
                            MODE_PRIVATE).edit();
                    editor.putString("auth_token", token);

                    if (user != null) {
                        editor.putString("user_email", user.getEmail());
                        editor.putString("user_name", user.getName());
                        editor.putString("user_role", user.getRole());
                        if (user.getNif() != null)
                            editor.putString("user_nif", user.getNif());
                        if (user.getGradeId() != null)
                            editor.putInt("user_grade_id", user.getGradeId());
                    }

                    editor.apply();

                    Toast.makeText(LoginActivity.this, "¡Bienvenido/a!", Toast.LENGTH_SHORT).show();

                    // Navegar a la pantalla de actividades
                    Intent intent = new Intent(LoginActivity.this, ActividadesActivity.class);
                    startActivity(intent);
                    finish();
                } else {
                    Toast.makeText(LoginActivity.this, "Error: Credenciales incorrectas", Toast.LENGTH_LONG).show();
                }
            }

            @Override
            public void onFailure(Call<Token> call, Throwable t) {
                // Error de red o servidor caído
                Toast.makeText(LoginActivity.this, "Error de conexión: " + t.getMessage(), Toast.LENGTH_LONG).show();
            }
        });
    }
}