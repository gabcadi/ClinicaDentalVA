"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const UserButton = () => {
  const router = useRouter();
  const { data: session, status } = useSession();

  if (status === 'loading') {
		return (
			<div className="flex items-center justify-center h-screen w-full">
				<Loader className="size-10 animate-spin text-sky-700" />
			</div>
		);
  }

  const avatarFallback = session?.user?.name?.charAt(0).toUpperCase() || "?";

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push("/");
  };

  return (
		<nav>
			{session ? (
				<DropdownMenu modal={false}>
					<DropdownMenuTrigger className="outline-none float-right p-4 cursor-pointer">
						<div className="flex gap-2 items-center group">
							<Avatar className="size-10 border-2 border-sky-700 group-hover:opacity-80 transition">
								<AvatarImage className="size-10" src={session.user?.image || undefined} alt={session.user?.name || 'Avatar'} />
								<AvatarFallback className="bg-sky-900 text-white">{avatarFallback}</AvatarFallback>
							</Avatar>
							<span className="font-semibold text-sky-900 group-hover:text-sky-700 transition hidden sm:block">
								{session.user?.name}
							</span>
						</div>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end" side="bottom" className="w-50 me-2">
						<div className="px-3 py-2">
							<p className="text-sm font-medium">{session.user?.name}</p>
							<p className="text-xs text-muted-foreground truncate">{session.user?.email}</p>
						</div>
						<DropdownMenuSeparator />
						<DropdownMenuItem className="h-10 text-sky-700 font-semibold cursor-pointer" onClick={() => router.push('/')}>
							Inicio
						</DropdownMenuItem>
						{session.user?.role === 'admin' && (
							<>
								<DropdownMenuItem
									className="h-10 text-sky-700 font-semibold cursor-pointer"
									onClick={() => router.push('/admin/appointments')}
								>
									Administrar citas
								</DropdownMenuItem>
								<DropdownMenuItem
									className="h-10 text-sky-700 font-semibold cursor-pointer"
									onClick={() => router.push('/admin/calendar')}
								>
									Calendario
								</DropdownMenuItem>
							</>
						)}
						{session.user?.role === 'doctor' && (
							<>
								<DropdownMenuItem
									className="h-10 text-sky-700 font-semibold cursor-pointer"
									onClick={() => router.push('/doctor')}
								>
									Panel Médico
								</DropdownMenuItem>
							</>
						)}
						<DropdownMenuSeparator />
						<DropdownMenuItem className="h-10 text-red-600 font-semibold cursor-pointer" onClick={handleSignOut}>
							Cerrar sesión
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			) : (
				<div className="flex justify-end p-4 gap-3">
					<Button asChild variant="outline" className="border-sky-700 text-sky-700 hover:bg-sky-50">
						<Link href="/sign-in">Iniciar sesión</Link>
					</Button>
					<Button asChild className="bg-sky-700 hover:bg-sky-800 text-white">
						<Link href="/sign-up">Registrarse</Link>
					</Button>
				</div>
			)}
		</nav>
  );
};

export default UserButton;