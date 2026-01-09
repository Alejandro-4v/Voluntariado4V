package com.example.aplicacionmovilvoluntaridado;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;

public class LoginActivity extends AppCompatActivity {


        // 1. Declaramos las variables que se ven en tu imagen
        EditText etCorreo, etPassword;
        Button btnLogin;
        TextView tvRegistrarse, tvOlvidaste;

        // IMPORTANTE: Pon aquí la IP o dominio real de tu API del voluntariado
        // Si pruebas en el emulador y la API está en tu PC local, usa http://10.0.2.2:puerto/api/login
        String URL_API = "http://10.0.2.2/voluntariado-cuatrovientos/public/";

        @Override
        protected void onCreate(Bundle savedInstanceState) {
            super.onCreate(savedInstanceState);
            setContentView(R.layout.activity_login); // Asegúrate que este nombre coincide con tu XML

            // 2. Enlazamos las variables con los IDs del diseño
            etCorreo = findViewById(R.id.etEmail);
            etPassword = findViewById(R.id.etPassword);
            btnLogin = findViewById(R.id.btnLogin);

            // 3. Acción del Botón "Iniciar sesión"
            btnLogin.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View view) {
                    String correo = etCorreo.getText().toString().trim();
                    String pass = etPassword.getText().toString().trim();

                    // Validación básica
                    if(correo.isEmpty() || pass.isEmpty()){
                        Toast.makeText(LoginActivity.this, "Por favor, rellena todos los campos", Toast.LENGTH_SHORT).show();
                    } else {
                        // Si todo está bien, llamamos a la API
                        loginVoluntario(correo, pass);
                    }
                }
            });

            // 4. Acción del texto "¿Aun no estás inscrito? Inscríbete"
        }

        private void loginVoluntario(final String correo, final String password) {
            // Mostramos un mensaje de carga (opcional, pero buena práctica)
            Toast.makeText(this, "Verificando...", Toast.LENGTH_SHORT).show();

            StringRequest stringRequest = new StringRequest(Request.Method.POST, URL_API,
                    new Response.Listener<String>() {
                        @Override
                        public void onResponse(String response) {
                            try {
                                // Procesamos la respuesta JSON del servidor
                                JSONObject jsonObject = new JSONObject(response);

                                // EJEMPLO: Ajusta esto según lo que devuelva TU API real.
                                // Supongamos que devuelve: {"status": "success", "token": "abc..."}
                                // O quizas devuelve un booleano: {"login": true}

                                // Verificamos si la respuesta indica éxito
                                // (Cambia "success" por la clave que use tu API)
                                boolean exito = jsonObject.optBoolean("success", false);

                                if (exito) {
                                    Toast.makeText(getApplicationContext(), "¡Bienvenido/a!", Toast.LENGTH_SHORT).show();

                                    // Navegar a la pantalla principal
                                    Intent intent = new Intent(getApplicationContext(), MainActivity.class);
                                    startActivity(intent);
                                    finish();
                                } else {
                                    String mensajeError = jsonObject.optString("message", "Credenciales incorrectas");
                                    Toast.makeText(getApplicationContext(), mensajeError, Toast.LENGTH_LONG).show();
                                }

                            } catch (JSONException e) {
                                e.printStackTrace();
                                Toast.makeText(getApplicationContext(), "Error al leer datos del servidor", Toast.LENGTH_SHORT).show();
                            }
                        }
                    },
                    new Response.ErrorListener() {
                        @Override
                        public void onErrorResponse(VolleyError error) {
                            Toast.makeText(getApplicationContext(), "Error de conexión: " + error.getMessage(), Toast.LENGTH_LONG).show();
                        }
                    }) {
                @Override
                protected Map<String, String> getParams() {
                    // AQUÍ SE ENVÍAN LOS DATOS.
                    // Las claves "email" y "password" deben coincidir con lo que espera tu API (backend).
                    Map<String, String> params = new HashMap<>();
                    params.put("email", correo);
                    params.put("password", password);
                    return params;
                }
            };

            RequestQueue requestQueue = Volley.newRequestQueue(this);
            requestQueue.add(stringRequest);
        }
    }