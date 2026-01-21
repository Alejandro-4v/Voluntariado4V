package com.example.aplicacionmovilvoluntaridado;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.viewpager2.adapter.FragmentStateAdapter;
import androidx.viewpager2.widget.ViewPager2;

import com.google.android.material.tabs.TabLayout;
import com.google.android.material.tabs.TabLayoutMediator;

public class AdminActividadesFragment extends Fragment {

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_admin_actividades, container, false);

        TabLayout tabLayout = view.findViewById(R.id.tabLayoutAdmin);
        ViewPager2 viewPager = view.findViewById(R.id.viewPagerAdmin);

        viewPager.setAdapter(new AdminPagerAdapter(this));

        new TabLayoutMediator(tabLayout, viewPager, (tab, position) -> {
            if (position == 0) {
                tab.setText("Próximas");
            } else {
                tab.setText("Pasadas");
            }
        }).attach();

        return view;
    }

    private static class AdminPagerAdapter extends FragmentStateAdapter {
        public AdminPagerAdapter(@NonNull Fragment fragment) {
            super(fragment);
        }

        @NonNull
        @Override
        public Fragment createFragment(int position) {
            if (position == 0) {
                return new AdminProximasFragment();
            } else {
                return new AdminPasadasFragment();
            }
        }

        @Override
        public int getItemCount() {
            return 2;
        }
    }
}
