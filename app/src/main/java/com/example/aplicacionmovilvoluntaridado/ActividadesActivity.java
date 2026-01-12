package com.example.aplicacionmovilvoluntaridado;

import android.os.Bundle;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import java.util.ArrayList;

public class ActividadesActivity extends AppCompatActivity {

    // [cite: 173] Declaramos la lista y el RecyclerView
    ArrayList<Actividad> dataList;
    RecyclerView recyclerView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_actividades); // El XML que hicimos antes

        // [cite: 176] Buscamos el RecyclerView por ID
        recyclerView = findViewById(R.id.rvActividades);

        // [cite: 184] Definimos el LayoutManager (Vertical)
        recyclerView.setLayoutManager(new LinearLayoutManager(this, LinearLayoutManager.VERTICAL, false));

        // Inicializamos y cargamos datos de prueba (Simulando la imagen)
        dataList = new ArrayList<>();
        cargarDatos();

        // [cite: 241] Instanciamos el adaptador pasándole la lista Y el Listener anónimo
        RecyclerDataAdapter adapter = new RecyclerDataAdapter(dataList, new RecyclerDataAdapter.OnItemClickListener() {
            @Override
            public void onItemClick(Actividad actividad, int position) {
                // [cite: 244] Acción al hacer click (ej: mostrar Toast)
                Toast.makeText(ActividadesActivity.this,
                        "Seleccionado: " + actividad.getNombre(),
                        Toast.LENGTH_SHORT).show();
            }
        });

        // [cite: 192] Asignamos el adaptador al Recycler
        recyclerView.setAdapter(adapter);
    }

    private void cargarDatos() {
        // Creamos datos dummy como en la imagen
        dataList.add(new Actividad("Recogida de alimentos", "Banco de Alimentos", "Pamplona - 12/10/2023"));
        dataList.add(new Actividad("Acompañamiento mayores", "Cruz Roja", "Burlada - 15/10/2023"));
        dataList.add(new Actividad("Limpieza del río", "Ayuntamiento", "Arga - 20/10/2023"));
        dataList.add(new Actividad("Apoyo escolar", "Asoc. Vecinos", "Rochapea - 22/10/2023"));
        dataList.add(new Actividad("Torneo benéfico", "Cuatrovientos", "Instituto - 25/10/2023"));
        dataList.add(new Actividad("Recogida de ropa", "Cáritas", "Centro - 01/11/2023"));
    }
}