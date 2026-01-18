<?php

namespace App\Repository;

use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use App\Entity\Voluntario;
use App\Entity\Disponibilidad; 

/**
 * @extends ServiceEntityRepository<Voluntario>
 */
class VoluntarioRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Voluntario::class);
    }

    public function add(Voluntario $voluntario): void
    {
        $this->getEntityManager()->persist($voluntario);

        $this->getEntityManager()->flush();
    }

    public function update(Voluntario $voluntario): void
    {
        $this->getEntityManager()->persist($voluntario);

        $this->getEntityManager()->flush();
    }

    public function remove(Voluntario $voluntario): void
    {
        $this->getEntityManager()->remove($voluntario);

        $this->getEntityManager()->flush();
    }

    /**
     * @return Voluntario[] Returns an array of Voluntario objects
     */
    public function findByFilters(array $filters): array
    {
        $qb = $this->createQueryBuilder('v');

        if (isset($filters['nombre'])) {
            $qb->andWhere('v.nombre LIKE :nombre')
                ->setParameter('nombre', '%' . $filters['nombre'] . '%');
        }

        if (isset($filters['apellidos'])) {
            $qb->andWhere('v.apellidos LIKE :apellidos')
                ->setParameter('apellidos', '%' . $filters['apellidos'] . '%');
        }

        if (isset($filters['nif'])) {
            $qb->andWhere('v.nif LIKE :nif')
                ->setParameter('nif', '%' . $filters['nif'] . '%');
        }

        if (isset($filters['mail'])) {
            $qb->andWhere('v.mail LIKE :mail')
                ->setParameter('mail', '%' . $filters['mail'] . '%');
        }

        if (isset($filters['grado'])) {
            $qb->andWhere('v.grado = :grado')
                ->setParameter('grado', $filters['grado']);
        }

        if (isset($filters['estado'])) {
            $qb->andWhere('v.estado = :estado')
                ->setParameter('estado', $filters['estado']);
        }

        if (isset($filters['dias'])) {
            $diasIds = array_map(
                'intval',
                explode(',', $filters['dias'])
            );

            $qb->leftJoin('v.disponibilidades', 'd')
                ->leftJoin('d.diaSemana', 'ds')
                ->andWhere('ds.diaSemana IN (:diasIds)')
                ->setParameter('diasIds', $diasIds);
        }

        if (isset($filters['tiposActividad'])) {
            $tiposActividadIds = array_map(
                'intval',
                explode(',', $filters['tiposActividad'])
            );

            $qb->leftJoin('v.tiposActividad', 'ta')
                ->andWhere('ta.idTipoActividad IN (:tiposActividadIds)')
                ->setParameter('tiposActividadIds', $tiposActividadIds);
        }

        if (isset($filters['limit']) && is_numeric($filters['limit'])) {
            $qb->setMaxResults((int) $filters['limit']);
        }

        $qb->orderBy('v.apellido1', 'ASC')
            ->addOrderBy('v.nombre', 'ASC');

        return $qb->getQuery()->getResult();
    }
}
