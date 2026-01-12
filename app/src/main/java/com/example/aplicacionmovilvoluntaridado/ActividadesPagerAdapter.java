package com.example.aplicacionmovilvoluntaridado;

import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentActivity;
import androidx.viewpager2.adapter.FragmentStateAdapter;

public class ActividadesPagerAdapter extends FragmentStateAdapter {

    public ActividadesPagerAdapter(@NonNull FragmentActivity fragmentActivity) {
        super(fragmentActivity);
    }

    @NonNull
    @Override
    public Fragment createFragment(int position) {
        switch (position) {
            case 0:
                return new ProximasActividadesFragment(); // Primera pestaña
            case 1:
                return new PasadasActividAdapteadesFragment();  // Segunda pestaña
            default:
                return new ProximasActividadesFragment();
        }
    }

    @Override
    public int getItemCount() {
        return 2; // Tenemos 2 pestañas
    }
}