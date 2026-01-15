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
    }
}