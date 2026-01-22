package com.example.aplicacionmovilvoluntaridado;

import android.content.Intent;
import android.os.Bundle;
import android.view.MenuItem;
import android.view.View;
import android.widget.LinearLayout;
import android.widget.ImageView;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityOptionsCompat;
import androidx.viewpager2.widget.ViewPager2;

import com.google.android.material.bottomnavigation.BottomNavigationView;
import com.google.android.material.navigation.NavigationBarView;

import com.example.aplicacionmovilvoluntaridado.models.Actividad;
import com.example.aplicacionmovilvoluntaridado.models.Ods;
import java.util.ArrayList;

// IMPLEMENTAMOS LAS 3 INTERFACES DE LOS FRAGMENTOS
public class ActividadesActivity extends AppCompatActivity implements
        HomeFragment.OnActividadSelectedListener,
        ProximasActividadesFragment.OnProximasActividadSelectedListener,
        PasadasActividadesFragment.OnPasadasActividadSelectedListener {

    BottomNavigationView bottomNavigation;
    ViewPager2 viewPager;
    LinearLayout headerLayout;
    androidx.appcompat.widget.SearchView searchView;
    android.view.View searchContainer;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_actividades);

        // --- LÓGICA DE LOGOUT ---
        android.widget.ImageButton btnLogout = findViewById(R.id.btnLogout);
        btnLogout.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                new androidx.appcompat.app.AlertDialog.Builder(ActividadesActivity.this)
                        .setTitle("Cerrar sesión")
                        .setMessage("¿Estás seguro de que quieres salir?")
                        .setPositiveButton("Salir", new android.content.DialogInterface.OnClickListener() {
                            public void onClick(android.content.DialogInterface dialog, int which) {
                                getSharedPreferences("VoluntariadoPrefs", MODE_PRIVATE).edit().clear().apply();
                                com.example.aplicacionmovilvoluntaridado.network.ApiClient.reset();

                                Intent intent = new Intent(ActividadesActivity.this, LoginActivity.class);
                                intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
                                startActivity(intent);
                                finish();
                            }
                        })
                        .setNegativeButton("Cancelar", null)
                        .show();
            }
        });

        // --- CONFIGURACIÓN DE BUSCADOR ---
        searchView = findViewById(R.id.searchView);
        searchContainer = findViewById(R.id.searchContainer);
        searchView.setIconifiedByDefault(false);
        searchView.setFocusable(true);

        searchView.setOnQueryTextListener(new androidx.appcompat.widget.SearchView.OnQueryTextListener() {
            @Override
            public boolean onQueryTextSubmit(String query) {
                ejecutarBusqueda(query);
                searchView.clearFocus();
                return true;
            }

            @Override
            public boolean onQueryTextChange(String newText) {
                ejecutarBusqueda(newText);
                return true;
            }
        });


        // --- CONFIGURACIÓN DE NAVEGACIÓN Y TABS ---
        bottomNavigation = findViewById(R.id.bottomNavigation);
        viewPager = findViewById(R.id.viewPager);
        headerLayout = findViewById(R.id.headerLayout);

        // Por defecto oculto en Home
        headerLayout.setVisibility(View.GONE);
        if (searchContainer != null) searchContainer.setVisibility(View.GONE);

        ActividadesPagerAdapter pagerAdapter = new ActividadesPagerAdapter(this);
        viewPager.setAdapter(pagerAdapter);

        // Sincronizar BottomNav -> ViewPager
        bottomNavigation.setOnItemSelectedListener(new NavigationBarView.OnItemSelectedListener() {
            @Override
            public boolean onNavigationItemSelected(@NonNull MenuItem menuItem) {
                if (menuItem.getItemId() == R.id.nav_inicio) {
                    viewPager.setCurrentItem(0, true);
                    return true;
                } else if (menuItem.getItemId() == R.id.nav_proximas) {
                    viewPager.setCurrentItem(1, true);
                    return true;
                } else if (menuItem.getItemId() == R.id.nav_pasadas) {
                    viewPager.setCurrentItem(2, true);
                    return true;
                }
                return false;
            }
        });

        // Sincronizar ViewPager -> BottomNav y visibilidad del Header
        viewPager.registerOnPageChangeCallback(new ViewPager2.OnPageChangeCallback() {
            @Override
            public void onPageSelected(int position) {
                super.onPageSelected(position);
                switch (position) {
                    case 0: // Home
                        bottomNavigation.setSelectedItemId(R.id.nav_inicio);
                        headerLayout.setVisibility(View.GONE);
                        if (searchContainer != null) searchContainer.setVisibility(View.GONE);
                        break;
                    case 1: // Próximas
                        bottomNavigation.setSelectedItemId(R.id.nav_proximas);
                        headerLayout.setVisibility(View.VISIBLE);
                        if (searchContainer != null) searchContainer.setVisibility(View.VISIBLE);
                        break;
                    case 2: // Pasadas
                        bottomNavigation.setSelectedItemId(R.id.nav_pasadas);
                        headerLayout.setVisibility(View.VISIBLE);
                        if (searchContainer != null) searchContainer.setVisibility(View.VISIBLE);
                        break;
                }
            }
        });
    }
    
    private void ejecutarBusqueda(String newText) {
        for (androidx.fragment.app.Fragment fragment : getSupportFragmentManager().getFragments()) {
            if (fragment instanceof ProximasActividadesFragment) {
                ((ProximasActividadesFragment) fragment).filtrarLista(newText);
            } else if (fragment instanceof PasadasActividadesFragment) {
                ((PasadasActividadesFragment) fragment).filtrarLista(newText);
            }
        }
    }


    // =========================================================================
    // IMPLEMENTACIÓN DE LAS INTERFACES DE NAVEGACIÓN (Fragment -> Activity)
    // =========================================================================

    // 1. Desde HomeFragment
    @Override
    public void onActividadSelected(Actividad actividad, ImageView sharedImage) {
        abrirDetalle(actividad, sharedImage);
    }

    // 2. Desde ProximasActividadesFragment
    @Override
    public void onProximasActividadSelected(Actividad actividad, ImageView sharedImage) {
        abrirDetalle(actividad, sharedImage);
    }

    // 3. Desde PasadasActividadesFragment
    @Override
    public void onPasadasActividadSelected(Actividad actividad, ImageView sharedImage) {
        abrirDetalle(actividad, sharedImage);
    }

    // MÉTODO PRIVADO CENTRALIZADO PARA LA NAVEGACIÓN
    private void abrirDetalle(Actividad actividad, ImageView sharedImage) {
        Intent intent = new Intent(this, DetalleActividadActivity.class);

        // Pasar todos los datos necesarios
        intent.putExtra("nombre", actividad.getNombre());
        intent.putExtra("entidad", actividad.getEntidadNombre());
        intent.putExtra("fecha", actividad.getFechaFormatted());
        intent.putExtra("lugar", actividad.getLugar());
        intent.putExtra("descripcion", actividad.getDescripcion());
        intent.putExtra("plazas", actividad.getPlazas());
        intent.putExtra("imagenUrl", actividad.getImagenUrl());

        // Casteo seguro de la lista ODS si es necesario
        if (actividad.getOds() != null) {
            intent.putExtra("listaOds", (ArrayList<Ods>) actividad.getOds());
        }

        intent.putExtra("actividad_object", actividad);

        // Iniciar con animación compartida si hay imagen
        if (sharedImage != null) {
            ActivityOptionsCompat options = ActivityOptionsCompat.makeSceneTransitionAnimation(
                    this, sharedImage, "transition_image_" + actividad.getIdActividad());
            startActivity(intent, options.toBundle());
        } else {
            startActivity(intent);
        }
    }
}