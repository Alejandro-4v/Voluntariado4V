package com.example.aplicacionmovilvoluntaridado;

import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;

public class DetalleActividadActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_detalle_actividad);

        // 1. Enlazamos con el XML
        TextView tvTitulo = findViewById(R.id.tvDetalleTitulo);
        TextView tvFecha = findViewById(R.id.tvDetalleFecha);
        TextView tvLugar = findViewById(R.id.tvDetalleLugar);
        TextView tvPlazas = findViewById(R.id.tvDetallePlazas);
        TextView tvDescripcion = findViewById(R.id.tvDetalleDescripcion);
        Button btnCerrar = findViewById(R.id.btnCerrar);
        Button btnValorar = findViewById(R.id.btnValorar);

        // 2. Recibimos los datos que nos envía la lista
        Bundle extras = getIntent().getExtras();
        if (extras != null) {
            String nombre = extras.getString("nombre");
            String entidad = extras.getString("entidad");
            String fecha = extras.getString("fecha");
            String lugar = extras.getString("lugar");
            String descripcion = extras.getString("descripcion");
            int plazas = extras.getInt("plazas");

            // 3. Rellenamos los huecos
            tvTitulo.setText(nombre + " - " + entidad);
            tvFecha.setText(fecha);
            tvLugar.setText(lugar);
            tvDescripcion.setText(descripcion);
            tvPlazas.setText("0 / " + plazas);
        }

        // 4. Funcionalidad botones
        btnCerrar.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                finish(); // Cierra la actividad y vuelve a la lista
            }
        });

        btnValorar.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                // Aquí en el futuro llamarás a la API para enviar la valoración
                Toast.makeText(DetalleActividadActivity.this, "¡Valoración enviada!", Toast.LENGTH_SHORT).show();
            }
        });
    }
}