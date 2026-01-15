package com.example.aplicacionmovilvoluntaridado;

import android.os.Bundle;
import android.view.MenuItem;
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

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_actividades);

        searchView = findViewById(R.id.searchView);
        searchView.setIconifiedByDefault(false);
        searchView.setFocusable(true);

        bottomNavigation = findViewById(R.id.bottomNavigation);
        viewPager = findViewById(R.id.viewPager);


        ActividadesPagerAdapter pagerAdapter = new ActividadesPagerAdapter(this);
        viewPager.setAdapter(pagerAdapter);

        // [cite: 400] Configurar listener del menú
        bottomNavigation.setOnItemSelectedListener(new NavigationBarView.OnItemSelectedListener() {
            @Override
            public boolean onNavigationItemSelected(@NonNull MenuItem menuItem) {
                if (menuItem.getItemId() == R.id.nav_proximas) {
                    viewPager.setCurrentItem(0, true);
                    return true;
                } else if (menuItem.getItemId() == R.id.nav_pasadas) {
                    viewPager.setCurrentItem(1, true);
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
                        bottomNavigation.setSelectedItemId(R.id.nav_proximas);
                        break;
                    case 1:
                        bottomNavigation.setSelectedItemId(R.id.nav_pasadas);
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
    private void ejecutarBusqueda (String newText){
        for (androidx.fragment.app.Fragment fragment : getSupportFragmentManager().getFragments()) {
            if (fragment instanceof ProximasActividadesFragment) {
                ((ProximasActividadesFragment) fragment).filtrarLista(newText);
            } else if (fragment instanceof PasadasActividadesFragment) {
                ((PasadasActividadesFragment) fragment).filtrarLista(newText);
            }
        }
    }
}