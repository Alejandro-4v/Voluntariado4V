<?php

namespace App\Repository;

use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use App\Entity\Actividad;
use App\Entity\Entidad;
use App\Entity\Grado;
use App\Entity\Ods;
use App\Entity\TipoActividad;

/**
 * @extends ServiceEntityRepository<Actividad>
 */
class ActividadRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Actividad::class);
    }

    public function add(Actividad $actividad): void
    {
        $this->getEntityManager()->persist($actividad);

        $this->getEntityManager()->flush();
    }

    public function update(Actividad $actividad): void
    {
        $this->getEntityManager()->persist($actividad);

        $this->getEntityManager()->flush();
    }

    public function remove(Actividad $actividad): void
    {
        $this->getEntityManager()->remove($actividad);

        $this->getEntityManager()->flush();
    }

    /**
     * @return Actividad[] Returns an array of Actividad objects
     */
    public function findByFilters(array $filters): array
    {
        $qb = $this->createQueryBuilder('a');

        if (isset($filters['nombre'])) {
            $qb->andWhere('a.nombre LIKE :nombre')
                ->setParameter('nombre', '%' . $filters['nombre'] . '%');
        }

        if (isset($filters['estado'])) {
            $qb->andWhere('a.estado = :estado')
                ->setParameter('estado', $filters['estado']);
        }

        if (isset($filters['convoca'])) {
            $qb->andWhere('a.convoca = :convocaId')
                ->setParameter('convocaId', $filters['convoca']);
        }

        if (isset($filters['grado'])) {
            $qb->andWhere('a.grado = :gradoId')
                ->setParameter('gradoId', $filters['grado']);
        }

        if (isset($filters['ods']) && is_array($filters['ods'])) {
            $qb->leftJoin('a.ods', 'o')
                ->andWhere($qb->expr()->in('o.id', ':odsIds'))
                ->setParameter('odsIds', $filters['ods']);
        }

        if (isset($filters['tiposActividad']) && is_array($filters['tiposActividad'])) {
            $qb->leftJoin('a.tiposActividad', 'ta')
                ->andWhere($qb->expr()->in('ta.id', ':tipoActividadIds'))
                ->setParameter('tipoActividadIds', $filters['tiposActividad']);
        }

        if (isset($filters['inicio_after'])) {
            $qb->andWhere('a.inicio >= :inicioAfter')
                ->setParameter('inicioAfter', new \DateTimeImmutable($filters['inicio_after']));
        }

        if (isset($filters['fin_before'])) {
            $qb->andWhere('a.fin <= :finBefore')
                ->setParameter('finBefore', new \DateTimeImmutable($filters['fin_before']));

        }

        if (isset($filters['limit']) && is_numeric($filters['limit'])) {
            $qb->setMaxResults((int)$filters['limit']);
        }

        $qb->orderBy('a.inicio', 'DESC');

        return $qb->getQuery()->getResult();
    }
}
