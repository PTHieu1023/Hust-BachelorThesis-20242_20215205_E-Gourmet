import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import {Link} from "@/i18n/navigation";

export interface BreadcrumbItemProps {
    label: string;
    href: string;
    isCurrent?: boolean;
}

export default function CommonBreadcrumb({items}: { items: BreadcrumbItemProps[] }) {
    return (
        <Breadcrumb className="mb-6">
            <BreadcrumbList>
                {items.map((item, index) => (
                    <BreadcrumbItem key={"breadcrumb-item-" + index}>
                        <BreadcrumbLink asChild>
                            <Link href={item.href} className={`${item?.isCurrent && "font-bold"}`}>{item.label}</Link>
                        </BreadcrumbLink>
                        {index < items.length - 1 && <BreadcrumbSeparator/>}
                    </BreadcrumbItem>
                ))}
            </BreadcrumbList>
        </Breadcrumb>
    )
}