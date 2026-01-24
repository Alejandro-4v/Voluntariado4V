package com.example.aplicacionmovilvoluntaridado;

import android.os.Bundle;
import android.view.MenuItem;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.fragment.app.Fragment;

import com.google.android.material.bottomnavigation.BottomNavigationView;
import com.google.android.material.navigation.NavigationBarView;

public class AdminDashboardActivity extends AppCompatActivity implements
        AdminProximasFragment.OnAdminProximasSelectedListener,
        AdminPasadasFragment.OnAdminPasadasSelectedListener {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_admin_dashboard);

        BottomNavigationView bottomNav = findViewById(R.id.bottom_navigation);
        
        android.widget.ImageButton btnLogout = findViewById(R.id.btnLogout);
        btnLogout.setOnClickListener(new android.view.View.OnClickListener() {
            @Override
            public void onClick(android.view.View v) {
                new androidx.appcompat.app.AlertDialog.Builder(AdminDashboardActivity.this)
                    .setTitle("Cerrar sesión")
                    .setMessage("¿Estás seguro de que quieres salir?")
                    .setPositiveButton("Salir", new android.content.DialogInterface.OnClickListener() {
                        public void onClick(android.content.DialogInterface dialog, int which) {
                             
                            getSharedPreferences("VoluntariadoPrefs", MODE_PRIVATE).edit().clear().apply();
                            com.example.aplicacionmovilvoluntaridado.network.ApiClient.reset();
                            
                             
                            android.content.Intent intent = new android.content.Intent(AdminDashboardActivity.this, LoginActivity.class);
                            intent.setFlags(android.content.Intent.FLAG_ACTIVITY_NEW_TASK | android.content.Intent.FLAG_ACTIVITY_CLEAR_TASK);
                            startActivity(intent);
                            finish();
                        }
                    })
                    .setNegativeButton("Cancelar", null)
                    .show();
            }
        });

        bottomNav.setOnItemSelectedListener(new NavigationBarView.OnItemSelectedListener() {
            @Override
            public boolean onNavigationItemSelected(@NonNull MenuItem item) {
                Fragment selectedFragment = null;

                if (item.getItemId() == R.id.nav_admin_activities) {
                    selectedFragment = new AdminActividadesFragment();
                } else if (item.getItemId() == R.id.nav_admin_volunteers) {
                    selectedFragment = new AdminVoluntariosFragment();
                }

                if (selectedFragment != null) {
                    getSupportFragmentManager().beginTransaction()
                            .replace(R.id.fragment_container, selectedFragment)
                            .commit();
                }
                return true;
            }
        });

         
        if (savedInstanceState == null) {
            getSupportFragmentManager().beginTransaction()
                    .replace(R.id.fragment_container, new AdminActividadesFragment())
                    .commit();
        }

         
        androidx.appcompat.widget.SearchView searchView = findViewById(R.id.searchViewAdmin);
        searchView.setOnQueryTextListener(new androidx.appcompat.widget.SearchView.OnQueryTextListener() {
            @Override
            public boolean onQueryTextSubmit(String query) {
                return false;
            }

            @Override
            public boolean onQueryTextChange(String newText) {
                Fragment f = getSupportFragmentManager().findFragmentById(R.id.fragment_container);
                if (f instanceof AdminActividadesFragment) {
                    ((AdminActividadesFragment) f).filtrarLista(newText);
                } else if (f instanceof AdminVoluntariosFragment) {
                    ((AdminVoluntariosFragment) f).filtrarLista(newText);
                }
                return true;
            }
        });
    }

     
     
     

    @Override
    public void onAdminProximasSelected(com.example.aplicacionmovilvoluntaridado.models.Actividad actividad, android.widget.ImageView sharedImage) {
        abrirDetalle(actividad, sharedImage);
    }

    @Override
    public void onAdminPasadasSelected(com.example.aplicacionmovilvoluntaridado.models.Actividad actividad, android.widget.ImageView sharedImage) {
        abrirDetalle(actividad, sharedImage);
    }

    private void abrirDetalle(com.example.aplicacionmovilvoluntaridado.models.Actividad actividad, android.widget.ImageView sharedImage) {
        android.content.Intent intent = new android.content.Intent(this, DetalleActividadActivity.class);
        intent.putExtra("actividad_object", actividad);
        intent.putExtra("nombre", actividad.getNombre());
        intent.putExtra("entidad", actividad.getEntidadNombre());
        intent.putExtra("fecha", actividad.getFechaFormatted());
        intent.putExtra("lugar", actividad.getLugar());
        intent.putExtra("descripcion", actividad.getDescripcion());
        intent.putExtra("plazas", actividad.getPlazas());
        intent.putExtra("imagenUrl", actividad.getImagenUrl());
        
         if (actividad.getOds() != null) {
            intent.putExtra("listaOds", (java.util.ArrayList<com.example.aplicacionmovilvoluntaridado.models.Ods>) actividad.getOds());
        }

        if (sharedImage != null) {
            androidx.core.app.ActivityOptionsCompat options = androidx.core.app.ActivityOptionsCompat.makeSceneTransitionAnimation(
                    this, sharedImage, "transition_image_" + actividad.getIdActividad());
            startActivity(intent, options.toBundle());
        } else {
            startActivity(intent);
        }
    }
}
