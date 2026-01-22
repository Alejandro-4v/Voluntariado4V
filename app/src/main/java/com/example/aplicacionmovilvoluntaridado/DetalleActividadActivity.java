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

            com.example.aplicacionmovilvoluntaridado.models.Actividad actividadObj = (com.example.aplicacionmovilvoluntaridado.models.Actividad) extras.getSerializable("actividad_object");

            // 3. Rellenamos los huecos
            // 3. Rellenamos los huecos con datos del objeto completo
            if (actividadObj != null) {
                tvTitulo.setText(actividadObj.getNombre() + " - " + actividadObj.getEntidadNombre());
                
                // Formato fechas
                // Formato fechas
                String fechaStr = "";
                try {
                    String inicioRaw = actividadObj.getInicio();
                    String finRaw = actividadObj.getFin();
                    
                    java.text.SimpleDateFormat isoFormat = new java.text.SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss", java.util.Locale.getDefault());
                    // Handle potential timezone offset if simple parser fails or use a more robust pattern if needed.
                    // Ideally, use a pattern that matches the server output.
                    // Server: 2026-12-05T15:30:00+00:00 -> This is typically ISO 8601
                    // Android SimpleDateFormat with 'X' or 'Z' handles timezones.
                    
                    // Let's try to parse the first part if timezone parsing is tricky with older APIs.
                    // Or use a precise pattern:
                    // Note: Patterns with 'XXX' require API 24. For compatibility, we might need to strip or handle manually if needed, 
                    // but assumes API is reasonably modern. If 'XXX' causes issues, we can try generic parsing.
                    
                    // Attempting a robust dual-parser approach
                    java.util.Date dateInicio = null;
                    java.util.Date dateFin = null;

                    // Try standard ISO with offset
                    try {
                         // This pattern handles "2026-12-05T15:30:00+00:00"
                        java.text.SimpleDateFormat iso8601 = new java.text.SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ssXXX", java.util.Locale.getDefault());
                        dateInicio = iso8601.parse(inicioRaw);
                        if (finRaw != null) dateFin = iso8601.parse(finRaw);
                    } catch (Exception e1) {
                        try {
                             // Fallback for no offset or different format
                            java.text.SimpleDateFormat isoLegacy = new java.text.SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss", java.util.Locale.getDefault());
                            dateInicio = isoLegacy.parse(inicioRaw);
                            if (finRaw != null) dateFin = isoLegacy.parse(finRaw);
                        } catch (Exception e2) {
                            // If all fails, keep raw
                        }
                    }

                    if (dateInicio != null) {
                        java.text.SimpleDateFormat outputDate = new java.text.SimpleDateFormat("dd/MM/yyyy", java.util.Locale.getDefault());
                        java.text.SimpleDateFormat outputHour = new java.text.SimpleDateFormat("HH:mm", java.util.Locale.getDefault());
                        
                        fechaStr = "Inicio: " + outputDate.format(dateInicio) + "  " + outputHour.format(dateInicio);
                        
                        if (dateFin != null) {
                             fechaStr += "\nFin:    " + outputDate.format(dateFin) + "  " + outputHour.format(dateFin);
                        }
                    } else {
                         // Fallback to raw string replacement if parsing failed completely
                         fechaStr = "Inicio: " + (inicioRaw != null ? inicioRaw.replace("T", " ") : "?");
                    }
                    
                } catch (Exception e) { 
                    fechaStr = "Fecha inválida"; 
                }
                tvFecha.setText(fechaStr);
                
                tvLugar.setText(actividadObj.getLugar());
                tvDescripcion.setText(actividadObj.getDescripcion());
                
                // Plazas Logic
                int currentVolunteers = 0;
                if (actividadObj.getVoluntarios() != null) {
                    currentVolunteers = actividadObj.getVoluntarios().size();
                }
                tvPlazas.setText(currentVolunteers + " / " + actividadObj.getPlazas());
                
                // Nuevos campos
                TextView tvEntidadInfo = findViewById(R.id.tvDetalleEntidadInfo);
                
                TextView tvLabelGrado = findViewById(R.id.tvLabelGrado);
                TextView tvGrado = findViewById(R.id.tvDetalleGrado);
                
                TextView tvLabelTipos = findViewById(R.id.tvLabelTipos);
                ChipGroup chipGroupTipos = findViewById(R.id.chipGroupDetalleTipos);
                
                TextView tvLabelOds = findViewById(R.id.tvLabelOds);
                // chipGroupOds is already bound at top
                
                // Entidad Info
                if (actividadObj.getConvoca() != null) {
                    String info = "Responsable: " + actividadObj.getConvoca().getNombreResponsable() + " " + actividadObj.getConvoca().getApellidosResponsable();
                    info += "\nEmail: " + actividadObj.getConvoca().getContactMail();
                    tvEntidadInfo.setText(info);
                    android.text.util.Linkify.addLinks(tvEntidadInfo, android.text.util.Linkify.EMAIL_ADDRESSES);
                    tvEntidadInfo.setLinksClickable(true);
                }
                
                // Grado Info
                if (actividadObj.getGrado() != null) {
                     tvLabelGrado.setVisibility(View.VISIBLE);
                     tvGrado.setVisibility(View.VISIBLE);
                     tvGrado.setText(actividadObj.getGrado().getDescripcion() + " (" + actividadObj.getGrado().getNivel() + ")");
                } else {
                     tvLabelGrado.setVisibility(View.GONE);
                     tvGrado.setVisibility(View.GONE);
                }
                
                // Tipos Chips
                if (actividadObj.getTiposActividad() != null && !actividadObj.getTiposActividad().isEmpty()) {
                    tvLabelTipos.setVisibility(View.VISIBLE);
                    chipGroupTipos.setVisibility(View.VISIBLE);
                    chipGroupTipos.removeAllViews(); // Clear previous if any
                    for (com.example.aplicacionmovilvoluntaridado.models.TipoActividad tipo : actividadObj.getTiposActividad()) {
                        Chip chip = new Chip(this);
                        chip.setText(tipo.getDescripcion());
                        chip.setCheckable(false);
                        chip.setChipBackgroundColorResource(android.R.color.holo_blue_light);
                        chip.setTextColor(getResources().getColor(android.R.color.white));
                        chipGroupTipos.addView(chip);
                    }
                } else {
                    tvLabelTipos.setVisibility(View.GONE);
                    chipGroupTipos.setVisibility(View.GONE);
                }

                 // ODS chips logic
                 boolean hasOds = false;
                 chipGroupOds.removeAllViews();
                 
                if (actividadObj.getOds() != null && !actividadObj.getOds().isEmpty()) {
                    hasOds = true;
                    for (com.example.aplicacionmovilvoluntaridado.models.Ods ods : actividadObj.getOds()) {
                        Chip chip = new Chip(this);
                        chip.setText(ods.getDescripcion());
                        chip.setCheckable(false);
                        chipGroupOds.addView(chip);
                    }
                } else if (listaOds != null && !listaOds.isEmpty()) {
                     hasOds = true;
                     for (Ods ods : listaOds) {
                        Chip chip = new Chip(this);
                        chip.setText(ods.getDescripcion());
                        chip.setCheckable(false);
                        chipGroupOds.addView(chip);
                    }
                }
                
                if (hasOds) {
                    if (tvLabelOds != null) tvLabelOds.setVisibility(View.VISIBLE);
                    chipGroupOds.setVisibility(View.VISIBLE);
                } else {
                    if (tvLabelOds != null) tvLabelOds.setVisibility(View.GONE);
                    chipGroupOds.setVisibility(View.GONE);
                }


                // Imagen
                if (actividadObj.getImagenUrl() != null && !actividadObj.getImagenUrl().isEmpty()) {
                     imagenUrl = actividadObj.getImagenUrl(); // Update local var for volley
                }
            } else {
                 // Fallback to extras legacy (should not happen with new flow)
                 tvTitulo.setText(nombre + " - " + entidad);
                 tvFecha.setText(fecha);
                 tvLugar.setText(lugar);
                 tvDescripcion.setText(descripcion);
                 tvPlazas.setText("0 / " + plazas);
                 
                 // ODS Legacy
                 if (listaOds != null) {
                    for (Ods ods : listaOds) {
                        Chip chip = new Chip(this);
                        chip.setText(ods.getDescripcion());
                        chip.setCheckable(false);
                        chipGroupOds.addView(chip);
                    }
                }
            }
            
            // Cargar imagen con Volley (Común)
            if (imagenUrl != null && !imagenUrl.isEmpty()) {
                final String finalUrl = imagenUrl;
                android.widget.ImageView ivImagen = findViewById(R.id.ivDetalleImagen);
                
                // Set Transition Name
                if (actividadObj != null) {
                    ivImagen.setTransitionName("transition_image_" + actividadObj.getIdActividad());
                }

                com.android.volley.toolbox.ImageRequest request = new com.android.volley.toolbox.ImageRequest(
                    finalUrl,
                    new com.android.volley.Response.Listener<android.graphics.Bitmap>() {
                        @Override
                        public void onResponse(android.graphics.Bitmap bitmap) {
                            android.util.Log.d("VOLLEY_DEBUG", "Image loaded successfully: " + finalUrl);
                            ivImagen.setImageBitmap(bitmap);
                        }
                    }, 0, 0, null, // Max width/height
                    new com.android.volley.Response.ErrorListener() {
                        public void onErrorResponse(com.android.volley.VolleyError error) {
                           android.util.Log.e("VOLLEY_DEBUG", "Error loading image: " + finalUrl + " Error: " + error.getMessage());
                           error.printStackTrace();
                        }
                    });
                com.android.volley.toolbox.Volley.newRequestQueue(this).add(request);
            }


            
            // 4. Lógica de Roles
            android.content.SharedPreferences prefs = getSharedPreferences("VoluntariadoPrefs", MODE_PRIVATE);
            String userRole = prefs.getString("user_role", "voluntario");
            
            // Views extras
            TextView tvLabelVoluntarios = findViewById(R.id.tvLabelVoluntarios);
            androidx.recyclerview.widget.RecyclerView rvVoluntarios = findViewById(R.id.rvDetalleVoluntarios);
            


            if ("ROLE_ADMIN".equals(userRole) || "admin".equalsIgnoreCase(userRole)) {
                // ADMIN VIEW
                btnValorar.setVisibility(View.GONE);
                
                if (actividadObj != null && actividadObj.getVoluntarios() != null && !actividadObj.getVoluntarios().isEmpty()) {
                    tvLabelVoluntarios.setVisibility(View.VISIBLE);
                    rvVoluntarios.setVisibility(View.VISIBLE);
                    
                    // Setup Adapter
                    rvVoluntarios.setLayoutManager(new androidx.recyclerview.widget.LinearLayoutManager(this));
                    VoluntariosAdapter adapter = new VoluntariosAdapter();
                    
                    // Map VoluntarioActividad -> Voluntario
                    ArrayList<com.example.aplicacionmovilvoluntaridado.models.Voluntario> mappedList = new ArrayList<>();
                    for (com.example.aplicacionmovilvoluntaridado.models.VoluntarioActividad va : actividadObj.getVoluntarios()) {
                        com.example.aplicacionmovilvoluntaridado.models.Voluntario v = new com.example.aplicacionmovilvoluntaridado.models.Voluntario();
                        v.setNif(va.getNif());
                        v.setNombre(va.getNombre());
                        v.setApellido1(va.getApellido1());
                        v.setApellido2(va.getApellido2());
                        v.setMail(va.getMail());
                        v.setPerfilUrl(va.getPerfilUrl());
                        v.setGrado(va.getGrado());
                        v.setEstado("A"); // Suponemos aceptado si está en la lista de la actividad
                        mappedList.add(v);
                    }
                    adapter.setDatos(mappedList);
                    rvVoluntarios.setAdapter(adapter);
                } else {
                     tvLabelVoluntarios.setVisibility(View.VISIBLE);
                     tvLabelVoluntarios.setText("No hay voluntarios inscritos.");
                }
                
            } else {
                // STUDENT VIEW
                btnValorar.setText("Informar de un problema");
                btnValorar.setCompoundDrawablesWithIntrinsicBounds(android.R.drawable.ic_dialog_email, 0, 0, 0);
                btnValorar.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        String contactMail = "soporte@cuatrovientos.org"; // Fallback
                        if (actividadObj != null && actividadObj.getConvoca() != null) {
                            contactMail = actividadObj.getConvoca().getContactMail();
                        }
                        
                        android.content.Intent emailIntent = new android.content.Intent(android.content.Intent.ACTION_SENDTO);
                        emailIntent.setData(android.net.Uri.parse("mailto:"));
                        emailIntent.putExtra(android.content.Intent.EXTRA_EMAIL, new String[]{contactMail});
                        emailIntent.putExtra(android.content.Intent.EXTRA_SUBJECT, "Incidencia en actividad: " + nombre);
                        emailIntent.putExtra(android.content.Intent.EXTRA_TEXT, "Hola, \n\nQuiero informar de un problema con la actividad '" + nombre + "'.\n\nDescripción del problema:\n");
                        
                        try {
                            startActivity(android.content.Intent.createChooser(emailIntent, "Enviar correo..."));
                        } catch (android.content.ActivityNotFoundException ex) {
                            Toast.makeText(DetalleActividadActivity.this, "No hay clientes de correo instalados.", Toast.LENGTH_SHORT).show();
                        }
                    }
                });
            }
        }

        // 5. Funcionalidad botones
        btnCerrar.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                finish(); // Cierra la actividad y vuelve a la lista
            }
        });
        
        // Listener original de valorar se ha movido/eliminado arriba
    }
}