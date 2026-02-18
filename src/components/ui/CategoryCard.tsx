import Link from 'next/link';
import Image from 'next/image';
import { Category } from '@/lib/types';

interface CategoryCardProps {
    category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
    return (
        <div className="group relative">
            <h4 className="text-center text-lg font-bold text-gray-900 mb-4 group-hover:text-[#010101] transition-colors">
                {category.name}
            </h4>
            <Link href={`/shop?category=${category.slug}`}>
                <div className="relative aspect-square rounded-3xl overflow-hidden shadow-lg">
                    <Image
                        src={category.image}
                        alt={category.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
            </Link>
        </div>
    );
}
