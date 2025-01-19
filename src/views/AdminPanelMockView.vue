<template>
    <div class="flex h-screen bg-gray-100">
        <aside class="flex flex-col w-64 text-white bg-blue-900">
            <div class="p-4 text-lg font-bold">Admin Panel</div>
            <nav class="flex-1">
                <ul>
                    <li class="p-4 cursor-pointer hover:bg-blue-700">
                        <a href="#">Dashboard</a>
                    </li>
                    <li class="p-4 cursor-pointer hover:bg-blue-700">
                        <a href="#">Users</a>
                    </li>
                    <li class="p-4 cursor-pointer hover:bg-blue-700">
                        <a href="#">Reports</a>
                    </li>
                    <li class="p-4 cursor-pointer hover:bg-blue-700">
                        <a href="#">Settings</a>
                    </li>
                </ul>
            </nav>
            <div class="p-4 border-t border-blue-700">
                <button
                    @click="$emit('logout')"
                    class="w-full p-2 text-left bg-red-600 rounded hover:bg-red-500"
                >
                    Logout
                </button>
            </div>
        </aside>

        <main class="flex-1 p-6 overflow-y-auto">
            <header class="mb-6">
                <h1 class="text-2xl font-bold text-gray-800">Welcome, Admin</h1>
                <p class="text-gray-600">Manage your system here.</p>
            </header>

            <div class="grid grid-cols-1 gap-6 mb-6 md:grid-cols-3">
                <div class="p-4 bg-white rounded-lg shadow">
                    <h2 class="font-bold text-gray-600">Total Users</h2>
                    <p class="text-3xl font-bold text-blue-600">1234</p>
                </div>
                <div class="p-4 bg-white rounded-lg shadow">
                    <h2 class="font-bold text-gray-600">New Reports</h2>
                    <p class="text-3xl font-bold text-green-600">56</p>
                </div>
                <div class="p-4 bg-white rounded-lg shadow">
                    <h2 class="font-bold text-gray-600">Pending Tasks</h2>
                    <p class="text-3xl font-bold text-red-600">9</p>
                </div>
            </div>

            <div class="p-6 bg-white rounded-lg shadow">
                <h2 class="mb-4 text-lg font-bold">User List</h2>
                <table class="w-full text-left border-collapse">
                    <thead>
                        <tr>
                            <th class="px-4 py-2 border-b">ID</th>
                            <th class="px-4 py-2 border-b">Name</th>
                            <th class="px-4 py-2 border-b">Email</th>
                            <th class="px-4 py-2 border-b">Role</th>
                            <th class="px-4 py-2 border-b">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td class="px-4 py-2 border-b">1</td>
                            <td class="px-4 py-2 border-b">John Doe</td>
                            <td class="px-4 py-2 border-b">john@example.com</td>
                            <td class="px-4 py-2 border-b">Admin</td>
                            <td class="px-4 py-2 border-b">
                                <button class="text-blue-600 hover:underline">Edit</button>
                                <button class="ml-2 text-red-600 hover:underline">Delete</button>
                            </td>
                        </tr>
                        <tr>
                            <td class="px-4 py-2 border-b">2</td>
                            <td class="px-4 py-2 border-b">Jane Smith</td>
                            <td class="px-4 py-2 border-b">jane@example.com</td>
                            <td class="px-4 py-2 border-b">User</td>
                            <td class="px-4 py-2 border-b">
                                <button class="text-blue-600 hover:underline">Edit</button>
                                <button class="ml-2 text-red-600 hover:underline">Delete</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </main>
    </div>
</template>

<script>
export default {
    name: 'AdminPanelView',
    methods: {
        logout() {
            console.log('Logged out')
        },
    },
}
</script>
