import React, { useMemo, useState } from 'react';
import { Building2, Dog, LogIn, PawPrint, UserPlus, Loader2 } from 'lucide-react';
import { Field } from '../../../shared/ui/Field';

const initialRegister = {
	role: '',
	name: '',
	email: '',
	phone: '',
	address: '',
	password: '',
	businessName: '',
	firstPet: {
		name: '',
		species: 'Cachorro',
		breed: '',
		age: ''
	}
};

const initialLogin = {
	email: '',
	password: ''
};

export function AuthScreen({ onRegister, onLogin }) {
	const [mode, setMode] = useState('login');
	const [registerForm, setRegisterForm] = useState(initialRegister);
	const [includeFirstPet, setIncludeFirstPet] = useState(false);
	const [loginForm, setLoginForm] = useState(initialLogin);
	const [message, setMessage] = useState('');
	const [messageType, setMessageType] = useState('info');
	const [loadingLogin, setLoadingLogin] = useState(false);
	const [loadingRegister, setLoadingRegister] = useState(false);

	const selectedRoleLabel = useMemo(() => {
		if (registerForm.role === 'tutor') {
			return 'Cadastro de Tutor';
		}

		if (registerForm.role === 'owner') {
			return 'Cadastro de Empresa';
		}

		return 'Escolha o perfil para continuar';
	}, [registerForm.role]);

	function updateRegister(field, value) {
		setRegisterForm((current) => ({ ...current, [field]: value }));
	}

	function updateFirstPet(field, value) {
		setRegisterForm((current) => ({
			...current,
			firstPet: {
				...current.firstPet,
				[field]: value
			}
		}));
	}

	function selectRole(role) {
		setMessage('');
		setIncludeFirstPet(false);
		setRegisterForm({
			...initialRegister,
			role
		});
	}

	function updateLogin(field, value) {
		setLoginForm((current) => ({ ...current, [field]: value }));
	}

	async function submitRegister(event) {
		event.preventDefault();
		if (!registerForm.role) return;

		setLoadingRegister(true);
		setMessage('');

		const payload = {
			...registerForm,
			firstPet: includeFirstPet ? registerForm.firstPet : null
		};
		const result = await onRegister(payload);
		setMessage(result.message);
		setMessageType(result.ok ? 'success' : 'error');

		if (result.ok) {
			setMode('login');
			setLoginForm({ email: registerForm.email, password: '' });
			setRegisterForm(initialRegister);
			setIncludeFirstPet(false);
		}

		setLoadingRegister(false);
	}

	async function submitLogin(event) {
		event.preventDefault();
		setLoadingLogin(true);
		setMessage('');

		const result = await onLogin(loginForm);

		if (!result.ok) {
			setMessage(result.message);
			setMessageType('error');
		} else {
			setMessage('Login realizado com sucesso!');
			setMessageType('success');
		}

		setLoadingLogin(false);
	}

	return (
		<main className="min-h-screen bg-paper px-4 py-8 sm:px-6">
			<div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
				<section className="space-y-5">
					<div className="flex items-center gap-3">
						<div className="grid h-12 w-12 place-items-center rounded-md bg-coral text-white shadow-soft">
							<PawPrint size={25} />
						</div>
						<div>
							<h1 className="text-2xl font-bold text-ink">PetCare Agenda</h1>
							<p className="text-sm text-ink/60">Gestão para tutores, pets e um petshop</p>
						</div>
					</div>
					<div className="space-y-3">
						<h2 className="text-3xl font-bold text-ink sm:text-4xl">
							Cadastros separados para clientes e petshop.
						</h2>
						<p className="max-w-xl text-base leading-7 text-ink/70">
							Tutores gerenciam seus pets e agendamentos. Donos de petshop acessam um dashboard
							do único estabelecimento cadastrado no sistema.
						</p>
					</div>
					<div className="grid gap-3 sm:grid-cols-3">
						<InfoBox title="Role" text="Tutor ou owner gravado no usuário." />
						<InfoBox title="Petshop único" text="Apenas um estabelecimento ativo no momento." />
						<InfoBox title="Escopo" text="Dados separados por usuário dentro do mesmo petshop." />
					</div>
				</section>

				<section className="rounded-md border border-ink/10 bg-white p-5 shadow-soft">
					<div className="grid grid-cols-2 rounded-md bg-paper p-1">
						<button
							type="button"
							onClick={() => {
								setMode('login');
								setMessage('');
							}}
							className={`flex min-h-11 items-center justify-center gap-2 rounded text-sm font-bold focus:outline-none focus:ring-2 focus:ring-ocean focus:ring-offset-2 ${
								mode === 'login' ? 'bg-ink text-white' : 'text-ink/65 hover:bg-mint'
							}`}
						>
							<LogIn size={17} />
							Login
						</button>
						<button
							type="button"
							onClick={() => {
								setMode('register');
								setMessage('');
							}}
							className={`flex min-h-11 items-center justify-center gap-2 rounded text-sm font-bold focus:outline-none focus:ring-2 focus:ring-ocean focus:ring-offset-2 ${
								mode === 'register' ? 'bg-ink text-white' : 'text-ink/65 hover:bg-mint'
							}`}
						>
							<UserPlus size={17} />
							Cadastro
						</button>
					</div>

					{message && (
						<div
							role="alert"
							className={`mt-4 rounded border px-3 py-2 text-sm font-semibold ${
								messageType === 'error'
									? 'border-coral/20 bg-coral/10 text-coral'
									: messageType === 'success'
									? 'border-ocean/20 bg-mint text-ocean'
									: 'border-ocean/20 bg-mint text-ocean'
							}`}
						>
							{message}
						</div>
					)}

					{mode === 'login' ? (
						<form className="mt-5 space-y-4" onSubmit={submitLogin}>
							<Field
								label="Email"
								type="email"
								id="login-email"
								value={loginForm.email}
								onChange={(value) => updateLogin('email', value)}
							/>
							<Field
								label="Senha"
								type="password"
								id="login-password"
								value={loginForm.password}
								onChange={(value) => updateLogin('password', value)}
							/>
							<button
								type="submit"
								disabled={loadingLogin}
								className="flex min-h-11 w-full items-center justify-center gap-2 rounded bg-coral px-4 text-sm font-bold text-white transition hover:bg-coral-hover focus:outline-none focus:ring-2 focus:ring-coral focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-ink/20 disabled:text-ink/45"
							>
								{loadingLogin ? (
									<Loader2 size={17} className="animate-spin" />
								) : (
									<LogIn size={17} />
								)}
								{loadingLogin ? 'Entrando...' : 'Entrar'}
							</button>
							<div className="space-y-1 text-xs text-ink/55">
								<p>Use suas credenciais ou crie uma conta na aba Cadastro.</p>
							</div>
						</form>
					) : (
						<form className="mt-5 space-y-5" onSubmit={submitRegister}>
							<div>
								<p className="text-sm font-bold text-ink">{selectedRoleLabel}</p>
								<div className="mt-3 grid gap-3 sm:grid-cols-2">
									<ProfileCard
										icon={Dog}
										title="Sou Tutor de Pet"
										text="Quero cadastrar meus pets e solicitar serviços."
										selected={registerForm.role === 'tutor'}
										onClick={() => selectRole('tutor')}
									/>
									<ProfileCard
										icon={Building2}
										title="Sou Empresa / Petshop"
										text="Quero receber e gerenciar agendamentos."
										selected={registerForm.role === 'owner'}
										onClick={() => selectRole('owner')}
									/>
								</div>
							</div>

							{registerForm.role === 'tutor' && (
								<TutorFields
									form={registerForm}
									includeFirstPet={includeFirstPet}
									onIncludeFirstPet={setIncludeFirstPet}
									onChange={updateRegister}
									onPetChange={updateFirstPet}
								/>
							)}

							{registerForm.role === 'owner' && (
								<OwnerFields form={registerForm} onChange={updateRegister} />
							)}

							<button
								type="submit"
								disabled={!registerForm.role || loadingRegister}
								className="flex min-h-11 w-full items-center justify-center gap-2 rounded bg-coral px-4 text-sm font-bold text-white transition hover:bg-coral-hover focus:outline-none focus:ring-2 focus:ring-coral focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-ink/20 disabled:text-ink/45"
							>
								{loadingRegister ? (
									<Loader2 size={17} className="animate-spin" />
								) : (
									<UserPlus size={17} />
								)}
								{loadingRegister ? 'Criando...' : 'Criar conta'}
							</button>
						</form>
					)}
				</section>
			</div>
		</main>
	);
}

function TutorFields({ form, includeFirstPet, onIncludeFirstPet, onChange, onPetChange }) {
	return (
		<div className="space-y-4">
			<div className="grid gap-4 sm:grid-cols-2">
				<Field label="Nome" id="tutor-name" value={form.name} onChange={(value) => onChange('name', value)} />
				<Field
					label="Email"
					type="email"
					id="tutor-email"
					value={form.email}
					onChange={(value) => onChange('email', value)}
				/>
				<Field label="Telefone" id="tutor-phone" value={form.phone} onChange={(value) => onChange('phone', value)} />
				<Field
					label="Endereço"
					id="tutor-address"
					value={form.address}
					onChange={(value) => onChange('address', value)}
				/>
				<Field
					label="Senha"
					type="password"
					id="tutor-password"
					value={form.password}
					onChange={(value) => onChange('password', value)}
				/>
			</div>

			<label className="flex items-center gap-2 rounded border border-ink/10 bg-paper p-3 text-sm font-bold text-ink/70">
				<input
					type="checkbox"
					id="include-first-pet"
					checked={includeFirstPet}
					onChange={(event) => onIncludeFirstPet(event.target.checked)}
					className="h-4 w-4 accent-coral focus:outline-none focus:ring-2 focus:ring-coral focus:ring-offset-2"
				/>
				Adicionar primeiro pet agora
			</label>

			{includeFirstPet && (
				<div className="grid gap-4 rounded border border-ink/10 bg-paper p-4 sm:grid-cols-4">
					<Field
						label="Nome do pet"
						id="pet-name"
						value={form.firstPet.name}
						onChange={(value) => onPetChange('name', value)}
					/>
					<label className="block">
						<span className="text-sm font-bold text-ink/70">Espécie</span>
						<select
							id="pet-species"
							value={form.firstPet.species}
							onChange={(event) => onPetChange('species', event.target.value)}
							className="mt-1 min-h-11 w-full rounded border border-ink/10 bg-white px-3 text-sm text-ink outline-none transition focus:border-ocean focus:ring-2 focus:ring-ocean/15"
						>
							<option>Cachorro</option>
							<option>Gato</option>
							<option>Outro</option>
						</select>
					</label>
					<Field
						label="Raça"
						id="pet-breed"
						value={form.firstPet.breed}
						onChange={(value) => onPetChange('breed', value)}
					/>
					<Field
						label="Idade"
						id="pet-age"
						value={form.firstPet.age}
						onChange={(value) => onPetChange('age', value)}
					/>
				</div>
			)}
		</div>
	);
}

function OwnerFields({ form, onChange }) {
	return (
		<div className="space-y-4">
			<div className="grid gap-4 sm:grid-cols-2">
				<Field
					label="Nome do responsável"
					id="owner-name"
					value={form.name}
					onChange={(value) => onChange('name', value)}
				/>
				<Field
					label="Email corporativo"
					type="email"
					id="owner-email"
					value={form.email}
					onChange={(value) => onChange('email', value)}
				/>
				<Field label="Telefone" id="owner-phone" value={form.phone} onChange={(value) => onChange('phone', value)} />
				<Field
					label="Senha"
					type="password"
					id="owner-password"
					value={form.password}
					onChange={(value) => onChange('password', value)}
				/>
			</div>

			<div className="grid gap-4 rounded border border-ink/10 bg-paper p-4 sm:grid-cols-[1fr_0.9fr]">
				<Field
					label="Razão social / Nome da loja"
					id="owner-business-name"
					value={form.businessName}
					onChange={(value) => onChange('businessName', value)}
				/>
				<div className="rounded border border-ink/10 bg-white px-3 py-2 text-sm text-ink/65">
					Este cadastro usa automaticamente o petshop único do sistema.
				</div>
			</div>
		</div>
	);
}

function ProfileCard({ icon: Icon, title, text, selected, onClick }) {
	return (
		<button
			type="button"
			onClick={onClick}
			className={`min-h-36 rounded-md border p-4 text-left transition focus:outline-none focus:ring-2 focus:ring-ocean focus:ring-offset-2 ${
				selected
					? 'border-ocean bg-mint shadow-soft'
					: 'border-ink/10 bg-white hover:border-ocean/40 hover:bg-paper'
			}`}
		>
			<div className="flex items-start gap-3">
				<div
					className={`grid h-11 w-11 place-items-center rounded ${
						selected ? 'bg-ocean text-white' : 'bg-paper text-coral'
					}`}
				>
					<Icon size={22} />
				</div>
				<div>
					<h3 className="font-bold text-ink">{title}</h3>
					<p className="mt-2 text-sm leading-6 text-ink/60">{text}</p>
				</div>
			</div>
		</button>
	);
}

function InfoBox({ title, text }) {
	return (
		<div className="rounded-md border border-ink/10 bg-white p-4 shadow-sm">
			<h3 className="font-bold text-ink">{title}</h3>
			<p className="mt-1 text-sm text-ink/60">{text}</p>
		</div>
	);
}