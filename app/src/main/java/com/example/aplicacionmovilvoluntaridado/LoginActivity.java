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
    private com.google.android.material.button.MaterialButtonToggleGroup toggleUserType;
    private android.widget.ProgressBar progressBar;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);

         
        etEmail = findViewById(R.id.etEmail);
        etPassword = findViewById(R.id.etPassword);
        btnLogin = findViewById(R.id.btnLogin);
        toggleUserType = findViewById(R.id.toggleUserType);
        progressBar = findViewById(R.id.progressBar);

         
        btnLogin.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                String email = etEmail.getText().toString().trim();
                String password = etPassword.getText().toString().trim();
                
                String userType = "voluntario";
                if (toggleUserType.getCheckedButtonId() == R.id.btnAdmin) {
                    userType = "administrador";
                }

                if (email.isEmpty() || password.isEmpty()) {
                    Toast.makeText(LoginActivity.this, "Rellena todos los campos", Toast.LENGTH_SHORT).show();
                } else {
                    loginConAPI(email, password, userType);
                }
            }
        });
    }

    private void loginConAPI(String email, String password, String userType) {
         
        progressBar.setVisibility(View.VISIBLE);
        btnLogin.setEnabled(false);
        btnLogin.setText("Iniciando sesión...");  

         
        LogIn loginData = new LogIn(email, password);

         
        ApiClient.getApiService(this).login(loginData, userType).enqueue(new Callback<Token>() {
            @Override
            public void onResponse(Call<Token> almendrasConSalYcall, Response<Token> response) {
                progressBar.setVisibility(View.GONE);
                btnLogin.setEnabled(true);
                btnLogin.setText("Iniciar sesión");

                if (response.isSuccessful() && response.body() != null) {
                     
                    Token tokenResponse = response.body();
                    String token = tokenResponse.getToken();
                    com.example.aplicacionmovilvoluntaridado.models.User user = tokenResponse.getUser();

                     
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

                    editor.commit();

                    Toast.makeText(LoginActivity.this, "¡Bienvenido/a!", Toast.LENGTH_SHORT).show();

                     
                    if (user != null && ("ROLE_ADMIN".equals(user.getRole()) || "admin".equalsIgnoreCase(user.getRole()))) {
                         Intent intent = new Intent(LoginActivity.this, AdminDashboardActivity.class);
                         startActivity(intent);
                    } else {
                         Intent intent = new Intent(LoginActivity.this, ActividadesActivity.class);
                         startActivity(intent);
                    }
                    finish();
                } else {
                    Toast.makeText(LoginActivity.this, "Error: Credenciales incorrectas", Toast.LENGTH_LONG).show();
                }
            }

            @Override
            public void onFailure(Call<Token> call, Throwable t) {
                progressBar.setVisibility(View.GONE);
                btnLogin.setEnabled(true);
                btnLogin.setText("Iniciar sesión");
                 
                Toast.makeText(LoginActivity.this, "Error de conexión: " + t.getMessage(), Toast.LENGTH_LONG).show();
            }
        });
    }
}