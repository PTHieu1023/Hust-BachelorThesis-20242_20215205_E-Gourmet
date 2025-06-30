import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import {Link} from "@/i18n/navigation";
import {Fragment, ReactNode} from "react";

export interface BreadcrumbItemProps {
    label: string | ReactNode;
    href: string;
    isCurrent?: boolean;
}

export default function CommonBreadcrumb({items}: { items: BreadcrumbItemProps[] }) {
    return (
        <Breadcrumb className="mb-6">
            <BreadcrumbList>
                {items.map((item, index) => (
                    <Fragment key={"breadcrumb-item-" + index}>
                        <BreadcrumbItem>
                            <Link href={item.href} className={`${item?.isCurrent && "font-bold"}`}>{item.label}</Link>
                        </BreadcrumbItem>
                        {index < items.length - 1 && <BreadcrumbSeparator/>}
                    </Fragment>
                ))}
            </BreadcrumbList>
        </Breadcrumb>
    )
}