"use client";

/**
 *
 * @param {LayoutProps} props
 * @returns {React.JSX.Element}
 */
export default function Layout({ children }: { children: React.ReactNode }): React.JSX.Element {
    return <main id="root">{children}</main>;
}
