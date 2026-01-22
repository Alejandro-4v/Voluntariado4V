package com.example.aplicacionmovilvoluntaridado;

import android.os.Bundle;
import android.view.MenuItem;
import android.view.View;
import android.widget.LinearLayout;
import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.viewpager2.widget.ViewPager2;
import com.google.android.material.bottomnavigation.BottomNavigationView;
import com.google.android.material.navigation.NavigationBarView;

public class ActividadesActivity extends AppCompatActivity {

    // Eliminamos RecyclerView y ArrayList de aquí.
    // La actividad solo coordina los fragments.
    BottomNavigationView bottomNavigation;
    ViewPager2 viewPager;
    androidx.appcompat.widget.SearchView searchView;
    LinearLayout headerLayout;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_actividades);

        android.widget.ImageButton btnLogout = findViewById(R.id.btnLogout);
        btnLogout.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                new androidx.appcompat.app.AlertDialog.Builder(ActividadesActivity.this)
                    .setTitle("Cerrar sesión")
                    .setMessage("¿Estás seguro de que quieres salir?")
                    .setPositiveButton("Salir", new android.content.DialogInterface.OnClickListener() {
                        public void onClick(android.content.DialogInterface dialog, int which) {
                            // Clear session
                            getSharedPreferences("VoluntariadoPrefs", MODE_PRIVATE).edit().clear().apply();
                            com.example.aplicacionmovilvoluntaridado.network.ApiClient.reset();
                            
                            // Go to login
                            android.content.Intent intent = new android.content.Intent(ActividadesActivity.this, LoginActivity.class);
                            intent.setFlags(android.content.Intent.FLAG_ACTIVITY_NEW_TASK | android.content.Intent.FLAG_ACTIVITY_CLEAR_TASK);
                            startActivity(intent);
                            finish();
                        }
                    })
                    .setNegativeButton("Cancelar", null)
                    .show();
            }
        });

        searchView = findViewById(R.id.searchView);
        searchView.setIconifiedByDefault(false);
        searchView.setFocusable(true);

        bottomNavigation = findViewById(R.id.bottomNavigation);
        viewPager = findViewById(R.id.viewPager);

        headerLayout = findViewById(R.id.headerLayout);
        headerLayout.setVisibility(View.GONE); // Default to hidden for Home tab

        ActividadesPagerAdapter pagerAdapter = new ActividadesPagerAdapter(this);
        viewPager.setAdapter(pagerAdapter);

      
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

        viewPager.registerOnPageChangeCallback(new ViewPager2.OnPageChangeCallback() {
            @Override
            public void onPageSelected(int position) {
                super.onPageSelected(position);
                switch (position) {
                    case 0:
                        bottomNavigation.setSelectedItemId(R.id.nav_inicio);
                        headerLayout.setVisibility(View.GONE);
                        break;
                    case 1:
                        bottomNavigation.setSelectedItemId(R.id.nav_proximas);
                        headerLayout.setVisibility(View.VISIBLE);
                        break;
                    case 2:
                        bottomNavigation.setSelectedItemId(R.id.nav_pasadas);
                        headerLayout.setVisibility(View.VISIBLE);
                        break;
                }
            }
        });
        searchView.setOnQueryTextListener(new androidx.appcompat.widget.SearchView.OnQueryTextListener() {
            @Override
            public boolean onQueryTextSubmit(String query) {
                ejecutarBusqueda(query);
                searchView.clearFocus(); // Oculta el teclado
                return true;
            }

            @Override
            public boolean onQueryTextChange(String newText) {
                ejecutarBusqueda(newText);
                return true;
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
}