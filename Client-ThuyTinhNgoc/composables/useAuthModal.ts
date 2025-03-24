export const useAuthModal = () => {
    const isLoginModalOpen = useState<boolean>('isLoginModalOpen', () => false);
    const isRegisterModalOpen = useState<boolean>('isRegisterModalOpen', () => false);

    const openLoginModal = () => {
        isLoginModalOpen.value = true;
    };

    const closeLoginModal = () => {
        isLoginModalOpen.value = false;
    };

    const openRegisterModal = () => {
        isRegisterModalOpen.value = true;
    };

    const closeRegisterModal = () => {
        isRegisterModalOpen.value = false;
    };

    return {
        isLoginModalOpen,
        isRegisterModalOpen,
        openLoginModal,
        closeLoginModal,
        openRegisterModal,
        closeRegisterModal
    };

};