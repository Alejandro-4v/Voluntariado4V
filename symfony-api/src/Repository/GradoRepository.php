<?php

namespace App\Repository;

use App\Entity\Grado;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Grado>
 */
class GradoRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Grado::class);
    }

    /**
     * @return Grado
     */
    public function findById($value): Grado
    {

        return $this->createQueryBuilder('g')
            ->andWhere('g.idGrado = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }

    /**
     * @return Grado[]
     */
    public function findByLevel(string $value): array
    {

        return $this->createQueryBuilder('g')
            ->andWhere('g.nivel = :val')
            ->setParameter('val', strtoupper($value))
            ->getQuery()
            ->getResult()
        ;
    }

    public function add(Grado $entity, bool $flush = false): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(Grado $entity, bool $flush = false): void
    {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }


}
