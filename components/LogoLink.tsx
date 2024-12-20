import Link from 'next/link'
import Image from 'next/image'

interface LogoLinkProps {
    showText?: boolean
}

const LogoLink = ({ showText = true }: LogoLinkProps) => {
    return (
        <Link href="/" className="flex items-center space-x-2">
            <Image src="/logo.jpeg" alt="NoteMeet Logo" width={40} height={40} />
            {showText && (
                <span className="text-2xl text-foreground"><span className="font-bold">note</span>meet</span>
            )}
        </Link>
    )
}

export default LogoLink