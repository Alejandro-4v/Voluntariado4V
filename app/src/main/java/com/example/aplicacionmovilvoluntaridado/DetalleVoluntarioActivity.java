package com.example.aplicacionmovilvoluntaridado;

import android.content.Intent;
import android.os.Bundle;
import android.view.MenuItem;
import android.view.View;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.example.aplicacionmovilvoluntaridado.models.Actividad;
import com.example.aplicacionmovilvoluntaridado.models.Voluntario;
import com.example.aplicacionmovilvoluntaridado.network.ApiClient;

import java.util.ArrayList;
import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class DetalleVoluntarioActivity extends AppCompatActivity {

    private TextView tvNombre, tvEmail, tvNif, tvGrado, tvEstado, tvEmpty;
    private RecyclerView rvActividades;
    private ProgressBar progressBar;
    private RecyclerDataAdapter adapter; 
    private String nifVoluntario;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_detalle_voluntario);

        // Setup Toolbar
        Toolbar toolbar = findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);
        if (getSupportActionBar() != null) {
            getSupportActionBar().setDisplayHomeAsUpEnabled(true);
            getSupportActionBar().setDisplayShowTitleEnabled(true);
        }

        // Initialize Views
        tvNombre = findViewById(R.id.tvDetalleNombre);
        tvEmail = findViewById(R.id.tvDetalleEmail);
        tvNif = findViewById(R.id.tvDetalleNif);
        tvGrado = findViewById(R.id.tvDetalleGrado);
        tvEstado = findViewById(R.id.tvDetalleEstado);
        tvEmpty = findViewById(R.id.tvEmptyActividades);
        rvActividades = findViewById(R.id.rvDetalleActividades);
        progressBar = findViewById(R.id.progressBarActividades);

        rvActividades.setLayoutManager(new LinearLayoutManager(this));
        // We reuse RecyclerDataAdapter assuming it works for Actividad items
        adapter = new RecyclerDataAdapter(new ArrayList<>(), (actividad, position, sharedImage) -> {
             // Handle click on activity if needed, maybe open Activity Detail?
             // user didn't ask explicitly but it's good UX
        });
        rvActividades.setAdapter(adapter);

        // Get Data from Intent
        // Ideally we pass the basic info or at least the NIF
        Voluntario voluntario = (Voluntario) getIntent().getSerializableExtra("voluntario_object");
        if (voluntario != null) {
            nifVoluntario = voluntario.getNif();
            setupBasicInfo(voluntario);
            cargarActividades(nifVoluntario);
        } else {
             // Fallback if only NIF passed
            nifVoluntario = getIntent().getStringExtra("nif");
            if (nifVoluntario != null) {
                cargarCompleto(nifVoluntario);
            } else {
                Toast.makeText(this, "Error: No se encontró el voluntario", Toast.LENGTH_SHORT).show();
                finish();
            }
        }
    }

    private void setupBasicInfo(Voluntario v) {
        String nombreCompleto = (v.getNombre() != null ? v.getNombre() : "") + " " +
                (v.getApellido1() != null ? v.getApellido1() : "") + " " +
                (v.getApellido2() != null ? v.getApellido2() : "");
        tvNombre.setText(nombreCompleto.trim());
        tvEmail.setText(v.getMail());
        tvNif.setText(v.getNif());
        if (v.getGrado() != null) {
            tvGrado.setText(v.getGrado().getDescripcion());
        } else {
            tvGrado.setText("-");
        }
        
        String estado = v.getEstado() != null ? v.getEstado() : "?";
        String estadoLabel = estado;
        int color = android.graphics.Color.GRAY;
        
        if ("A".equals(estado)) {
            estadoLabel = "Activo";
            color = android.graphics.Color.parseColor("#4CAF50");
        } else if ("P".equals(estado)) {
             estadoLabel = "Pendiente";
             color = android.graphics.Color.parseColor("#FF9800");
        } else if ("I".equals(estado)) {
             estadoLabel = "Inactivo";
        } else if ("R".equals(estado)) {
             estadoLabel = "Rechazado";
             color = android.graphics.Color.RED;
        }
        tvEstado.setText(estadoLabel);
        tvEstado.setTextColor(color);

        // Load Image
        android.widget.ImageView ivPerfil = findViewById(R.id.ivDetalleImagen);
        android.util.Log.d("DetalleVoluntario", "Cargando imagen perfil: " + v.getPerfilUrl());
        
        if (v.getPerfilUrl() != null && !v.getPerfilUrl().isEmpty()) {
             // Ensure no tint is interfering
             androidx.core.widget.ImageViewCompat.setImageTintList(ivPerfil, null);
             ivPerfil.setColorFilter(null);
             
             com.bumptech.glide.Glide.with(this)
                .load(v.getPerfilUrl())
                .placeholder(android.R.drawable.sym_def_app_icon)
                .error(android.R.drawable.sym_def_app_icon)
                .circleCrop()
                .listener(new com.bumptech.glide.request.RequestListener<android.graphics.drawable.Drawable>() {
                    @Override
                    public boolean onLoadFailed(@androidx.annotation.Nullable com.bumptech.glide.load.engine.GlideException e, Object model, com.bumptech.glide.request.target.Target<android.graphics.drawable.Drawable> target, boolean isFirstResource) {
                        android.util.Log.e("DetalleVoluntario", "Error loading image: " + e.getMessage());
                        e.logRootCauses("DetalleVoluntario"); 
                        return false;
                    }
                    @Override
                    public boolean onResourceReady(android.graphics.drawable.Drawable resource, Object model, com.bumptech.glide.request.target.Target<android.graphics.drawable.Drawable> target, com.bumptech.glide.load.DataSource dataSource, boolean isFirstResource) {
                        android.util.Log.d("DetalleVoluntario", "Imagen cargada correctamente desde: " + dataSource);
                        return false;
                    }
                })
                .into(ivPerfil);
        } else {
             android.util.Log.d("DetalleVoluntario", "URL de perfil es nula o vacía");
        }
    }

    private void cargarCompleto(String nif) {
        progressBar.setVisibility(View.VISIBLE);
        
        // 1. Fetch Volunteer Details (to ensure we have latest profile info)
        ApiClient.getApiService(this).getVoluntario(nif).enqueue(new Callback<Voluntario>() {
            @Override
            public void onResponse(Call<Voluntario> call, Response<Voluntario> response) {
                if (response.isSuccessful() && response.body() != null) {
                    Voluntario v = response.body();
                    setupBasicInfo(v);
                    
                    // 2. Fetch ALL activities and filter manually (backup strategy)
                    cargarTodasLasActividadesYFiltrar(nif);
                } else {
                    progressBar.setVisibility(View.GONE);
                }
            }
            @Override
            public void onFailure(Call<Voluntario> call, Throwable t) {
                progressBar.setVisibility(View.GONE);
                Toast.makeText(DetalleVoluntarioActivity.this, "Error cargando datos", Toast.LENGTH_SHORT).show();
            }
        });
    }

    private void cargarTodasLasActividadesYFiltrar(String targetNif) {
        // Fetch all activities safely (using generic search params if needed, or null)
        ApiClient.getApiService(this).getActividades(null, null, null, null, null, null).enqueue(new Callback<List<Actividad>>() {
            @Override
            public void onResponse(Call<List<Actividad>> call, Response<List<Actividad>> response) {
                progressBar.setVisibility(View.GONE);
                if (response.isSuccessful() && response.body() != null) {
                    List<Actividad> todas = response.body();
                    List<Actividad> delVoluntario = new ArrayList<>();
                    
                    for (Actividad a : todas) {
                        if (a.getVoluntarios() != null) {
                            for (com.example.aplicacionmovilvoluntaridado.models.VoluntarioActividad va : a.getVoluntarios()) {
                                if (va.getNif() != null && va.getNif().equalsIgnoreCase(targetNif)) {
                                    delVoluntario.add(a);
                                    break; // Found the volunteer in this activity, move to next activity
                                }
                            }
                        }
                    }
                    filtrarYMostrarActividades(delVoluntario);
                } else {
                    tvEmpty.setVisibility(View.VISIBLE);
                }
            }
            @Override
            public void onFailure(Call<List<Actividad>> call, Throwable t) {
                progressBar.setVisibility(View.GONE);
                Toast.makeText(DetalleVoluntarioActivity.this, "Error cargando actividades", Toast.LENGTH_SHORT).show();
            }
        });
    }

    private void cargarActividades(String nif) {
         // If we already have the basic info, maybe the object passed didn't have full details/list
         // So we fetch it again to be sure, or just rely on the passed object if it had them?
         // The user said "voluntariados proximos donde participa". 
         // Assuming getVoluntario(nif) returns everything.
         cargarCompleto(nif);
    }
    
    private void filtrarYMostrarActividades(List<Actividad> actividades) {
         // Filter for FUTURE activities
         List<Actividad> proximas = new ArrayList<>();
         java.text.SimpleDateFormat sdf = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
         java.util.Date now = new java.util.Date();

         for (Actividad a : actividades) {
             if (a.getInicio() != null) {
                 try {
                     String dateStr = a.getInicio().replace("T", " ");
                     if (dateStr.contains("+")) {
                         dateStr = dateStr.substring(0, dateStr.indexOf("+"));
                     }
                     java.util.Date activityDate = sdf.parse(dateStr);
                     if (activityDate != null && (activityDate.after(now) || activityDate.equals(now))) {
                         proximas.add(a);
                     }
                 } catch (Exception e) {
                     // ignore parse error
                 }
             }
         }

         adapter.setDatos(proximas);
         if (proximas.isEmpty()) {
             rvActividades.setVisibility(View.GONE);
             tvEmpty.setVisibility(View.VISIBLE);
         } else {
             rvActividades.setVisibility(View.VISIBLE);
             tvEmpty.setVisibility(View.GONE);
         }
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        if (item.getItemId() == android.R.id.home) {
            onBackPressed();
            return true;
        }
        return super.onOptionsItemSelected(item);
    }
}
