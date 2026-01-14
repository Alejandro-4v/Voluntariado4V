<?php

namespace App\Repository;

use DateTimeImmutable;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use App\Entity\Actividad;
use Exception;

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
     * @throws Exception
     */
    public function findByFilters(array $filters): array
    {
        $qb = $this->createQueryBuilder('a');

        if (isset($filters['nombre'])) {
            $qb->andWhere('a.nombre LIKE :nombre')
                ->setParameter('nombre', '%' . $filters['nombre'] . '%');
        }

        if (isset($filters['lugar'])) {
            $qb->andWhere('a.lugar LIKE :lugar')
                ->setParameter('lugar', '%' . $filters['lugar'] . '%');
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

        if (isset($filters['ods'])) {
            $odsIds = array_map(
                'intval',
                explode(',', $filters['ods'])
            );

            $qb->leftJoin('a.ods', 'o')
                ->andWhere('o.idOds IN (:odsIds)')
                ->setParameter('odsIds', $odsIds);
        }

        if (isset($filters['tiposActividad'])) {
            $tiposActividadIds = array_map(
                'intval',
                explode(',', $filters['tiposActividad'])
            );

            $qb->leftJoin('a.tiposActividad', 'ta')
                ->andWhere('ta.idTipoActividad IN (:tiposActividadIds)')
                ->setParameter('tiposActividadIds', $tiposActividadIds);
        }

        if (isset($filters['inicio_after'])) {
            $qb->andWhere('a.inicio >= :inicioAfter')
                ->setParameter('inicioAfter', new DateTimeImmutable($filters['inicio_after']));
        }

        if (isset($filters['fin_before'])) {
            $qb->andWhere('a.fin <= :finBefore')
                ->setParameter('finBefore', new DateTimeImmutable($filters['fin_before']));

        }

        if (isset($filters['limit']) && is_numeric($filters['limit'])) {
            $qb->setMaxResults((int)$filters['limit']);
        }

        $qb->orderBy('a.inicio', 'DESC');

        return $qb->getQuery()->getResult();
    }
}
