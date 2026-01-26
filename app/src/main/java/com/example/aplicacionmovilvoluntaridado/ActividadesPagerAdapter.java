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
                return new HomeFragment();  
            case 1:
                return new ProximasActividadesFragment();  
            case 2:
                return new PasadasActividadesFragment();  
            default:
                return new HomeFragment();
        }
    }

    @Override
    public int getItemCount() {
        return 3;  
    }
}