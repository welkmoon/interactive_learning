<script lang="ts">
	import dayjs from 'dayjs';
	import { Avatar } from 'flowbite-svelte';
	import type { MessageSchema } from './schema';
	import 'dayjs/locale/uk';
	import { Link } from 'carbon-components-svelte';

	dayjs.locale('uk');

	export let name: string;
	export let messages: MessageSchema[];
</script>

<h2 class="mb-4 text-xl md:text-3xl font-bold">Вітаю, {name}!</h2>

<table class="flex flex-col gap-2 w-full max-h-full caption-bottom text-sm">
	<thead class="w-full">
		<tr class="flex w-full">
			<th class="font-medium"> Історія повідомлень ваших класів: </th>
		</tr>
	</thead>
	<tbody class="flex flex-col gap-2">
		{#each messages as { courseName, slug, sectionTitle, topicName, authorName, message, _createdAt }}
			<div class="flex flex-col gap-4 p-4 bg-white">
				<div class="flex items-center">
					<div class="flex gap-4 items-center justify-between w-full">
						<div class="flex gap-4 items-center">
							<Avatar class="w-6" size="xs" rounded />
							<div class="text-nowrap italic">{authorName}</div>
							<Link class="text-nowrap italic" href="/courses/{slug}">
								{topicName} > {courseName} > {sectionTitle}
							</Link>
						</div>
						<div class="flex items-center gap-2">
							<div class="text-nowrap">
								{dayjs(_createdAt).format('D MMMM YYYY')}
							</div>
						</div>
					</div>
				</div>
				<div class="w-full italic">{message}</div>
			</div>
		{/each}
	</tbody>
</table>
