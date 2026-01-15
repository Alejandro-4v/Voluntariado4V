package com.example.aplicacionmovilvoluntaridado;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;


public class LoginActivity extends AppCompatActivity {

<<<<<<< HEAD
    // 1. Declaramos las variables que se ven en tu imagen
    EditText etCorreo, etPassword;
    Button btnLogin;
    TextView tvRegistrarse, tvOlvidaste;

    // IMPORTANTE: Pon aquí la IP o dominio real de tu API del voluntariado
    // Si pruebas en el emulador y la API está en tu PC local, usa
    // http://10.0.2.2:puerto/api/login
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
                if (correo.isEmpty() || pass.isEmpty()) {
                    Toast.makeText(LoginActivity.this, "Por favor, rellena todos los campos", Toast.LENGTH_SHORT)
                            .show();
                } else {
                    // Llamamos a la API
                    loginVoluntario(correo, pass);
                }
            }
        });

        // 4. Acción del texto "¿Aun no estás inscrito? Inscríbete"
    }

    private void loginVoluntario(final String correo, final String password) {
        // [MOCK] Login API provisionalmente deshabilitado
        if (correo.equals("iryna_pavlenko@cuatrovientos.org") && password.equals("1234")) {
            Toast.makeText(getApplicationContext(), "¡Bienvenido/a! (Modo Prueba)", Toast.LENGTH_SHORT).show();
            Intent intent = new Intent(getApplicationContext(), ActividadesActivity.class);
            startActivity(intent);
            finish();
        } else {
            Toast.makeText(getApplicationContext(), "Credenciales incorrectas (Prueba: iryna.../1234)",
                    Toast.LENGTH_LONG).show();
        }

        /*
         * // Implementación Retrofit (Deshabilitada temporalmente)
         * com.example.aplicacionmovilvoluntaridado.models.LogIn loginData =
         * new com.example.aplicacionmovilvoluntaridado.models.LogIn(correo, password);
         * 
         * com.example.aplicacionmovilvoluntaridado.network.ApiClient.getApiService().
         * login(loginData)
         * .enqueue(new
         * retrofit2.Callback<com.example.aplicacionmovilvoluntaridado.models.Token>() {
         * 
         * @Override
         * public void
         * onResponse(retrofit2.Call<com.example.aplicacionmovilvoluntaridado.models.
         * Token> call,
         * retrofit2.Response<com.example.aplicacionmovilvoluntaridado.models.Token>
         * response) {
         * if (response.isSuccessful() && response.body() != null) {
         * String token = response.body().getToken();
         * 
         * // Guardar token en SharedPreferences
         * getSharedPreferences("VoluntariadoPrefs", MODE_PRIVATE)
         * .edit()
         * .putString("auth_token", token)
         * .apply();
         * 
         * Toast.makeText(getApplicationContext(), "¡Bienvenido/a!",
         * Toast.LENGTH_SHORT).show();
         * 
         * Intent intent = new Intent(getApplicationContext(),
         * ActividadesActivity.class);
         * startActivity(intent);
         * finish();
         * } else {
         * Toast.makeText(getApplicationContext(), "Credenciales incorrectas",
         * Toast.LENGTH_LONG)
         * .show();
         * }
         * }
         * 
         * @Override
         * public void
         * onFailure(retrofit2.Call<com.example.aplicacionmovilvoluntaridado.models.
         * Token> call,
         * Throwable t) {
         * Toast.makeText(getApplicationContext(), "Error de conexión: " +
         * t.getMessage(),
         * Toast.LENGTH_LONG).show();
         * }
         * });
         */
=======
    // Declaramos las variables para los elementos de la pantalla
    private EditText etEmail;
    private EditText etPassword;
    private Button btnLogin;
    private TextView tvRegister, tvForgotPassword;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login); // Vinculamos con el XML que diseñamos antes

        // 1. INICIALIZAR VISTAS (Enlazar con los IDs del XML)
        etEmail = findViewById(R.id.etEmail);
        etPassword = findViewById(R.id.etPassword);
        btnLogin = findViewById(R.id.btnLogin);
       // tvRegister = findViewById(R.id.tvRegister);
        tvForgotPassword = findViewById(R.id.tvForgotPassword);

        // 2. ESTILO VISUAL (Opcional)
        // Hacemos que la palabra "Inscríbete" salga en azul usando HTML
        String textoRegistro = "¿Aún no estás inscrito? <font color='#0F3B82'><b>Inscríbete</b></font>";
        //tvRegister.setText(Html.fromHtml(textoRegistro, Html.FROM_HTML_MODE_LEGACY));

        // 3. PROGRAMAR EL BOTÓN DE LOGIN
        btnLogin.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                // Recogemos lo que el usuario ha escrito
                String email = etEmail.getText().toString().trim();
                String password = etPassword.getText().toString().trim();

                // --- LÓGICA MOCK (SIMULADA) ---

                // Validación 1: Campos vacíos
                if (email.isEmpty() || password.isEmpty()) {
                    Toast.makeText(LoginActivity.this,
                            "Por favor, introduce correo y contraseña",
                            Toast.LENGTH_SHORT).show();
                    return; // Detenemos la ejecución aquí
                }

                // Validación 2: Simular credenciales correctas
                // Aceptamos cualquier email, pero la contraseña DEBE ser "1234"
                if (password.equals("1234")) {

                    // ¡Login correcto!
                    Toast.makeText(LoginActivity.this, "¡Bienvenido/a!", Toast.LENGTH_SHORT).show();

                    // Navegamos a la siguiente pantalla (ActividadesActivity)
                    Intent intent = new Intent(LoginActivity.this, ActividadesActivity.class);
                    startActivity(intent);

                    // Finalizamos esta actividad para que si dan "Atrás" no vuelvan al login
                    finish();

                } else {
                    // Contraseña incorrecta
                    Toast.makeText(LoginActivity.this,
                            "Credenciales incorrectas (Prueba con: 1234)",
                            Toast.LENGTH_LONG).show();
                }
            }
        });

        // 4. PROGRAMAR EL BOTÓN DE REGISTRO (Opcional por ahora)
        //tvRegister.setOnClickListener(new View.OnClickListener() {
        //    @Override
        //    public void onClick(View v) {
        //        Toast.makeText(LoginActivity.this, "Ir a pantalla de registro...", Toast.LENGTH_SHORT).show();
        //    }
        //});
>>>>>>> main
    }
}