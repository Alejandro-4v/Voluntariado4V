package com.example.aplicacionmovilvoluntaridado;

import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;

import com.google.android.material.chip.Chip;
import com.google.android.material.chip.ChipGroup;
import com.example.aplicacionmovilvoluntaridado.models.Ods;
import java.util.ArrayList;

// ...

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
        ChipGroup chipGroupOds = findViewById(R.id.chipGroupDetalleOds);
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

            // Recibir lista de ODS
            ArrayList<Ods> listaOds = (ArrayList<Ods>) extras.getSerializable("listaOds");

            String imagenUrl = extras.getString("imagenUrl");

            // 3. Rellenamos los huecos
            tvTitulo.setText(nombre + " - " + entidad);
            tvFecha.setText(fecha);
            tvLugar.setText(lugar);
            tvDescripcion.setText(descripcion);
            tvPlazas.setText("0 / " + plazas); // Assuming initial capacity 0 or similar, user can adjust

            // Cargar imagen con Volley
            if (imagenUrl != null && !imagenUrl.isEmpty()) {
                android.widget.ImageView ivImagen = findViewById(R.id.ivDetalleImagen);
                com.android.volley.toolbox.ImageRequest request = new com.android.volley.toolbox.ImageRequest(
                    imagenUrl,
                    new com.android.volley.Response.Listener<android.graphics.Bitmap>() {
                        @Override
                        public void onResponse(android.graphics.Bitmap bitmap) {
                            android.util.Log.d("VOLLEY_DEBUG", "Image loaded successfully: " + imagenUrl);
                            ivImagen.setImageBitmap(bitmap);
                        }
                    }, 0, 0, null, // Max width/height
                    new com.android.volley.Response.ErrorListener() {
                        public void onErrorResponse(com.android.volley.VolleyError error) {
                           android.util.Log.e("VOLLEY_DEBUG", "Error loading image: " + imagenUrl + " Error: " + error.getMessage());
                           error.printStackTrace();
                        }
                    });
                com.android.volley.toolbox.Volley.newRequestQueue(this).add(request);
            }

            // Rellenar ODS chips
            if (listaOds != null) {
                for (Ods ods : listaOds) {
                    Chip chip = new Chip(this);
                    chip.setText(ods.getDescripcion());
                    chip.setCheckable(false);
                    chipGroupOds.addView(chip);
                }
            }
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