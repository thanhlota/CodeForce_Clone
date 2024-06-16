import { wrapper } from "@/redux/store";
import UserService from "@/services/user.service";
import { initUser } from "@/redux/reducers/user.reducer";

const updateUserInfo = wrapper.getServerSideProps((store) => async ({ req }) => {
    let accessToken = req.cookies["access_token"];

    if (accessToken && !store.getState().user.id) {
        try {
            const userInfo = await UserService.validateToken(accessToken);

            if (!userInfo.id) {
                console.error('Token validation failed');
            } else {
                store.dispatch(initUser(userInfo));
            }

        } catch (error) {
            console.error('Token validation failed:', error);
        }
    }

    return {
        props: {},
    };
})

const authorizeUser = wrapper.getServerSideProps((store) => async ({ req }) => {
    let accessToken = req.cookies["access_token"];

    if (accessToken && !store.getState().user.id) {
        try {
            const userInfo = await UserService.validateToken(accessToken);

            if (!userInfo.id) {
                console.error('Token validation failed');
            } else {
                store.dispatch(initUser(userInfo));
            }

        } catch (error) {
            console.error('Token validation failed:', error);
            return {
                redirect: {
                    destination: '/',
                    permanent: false,
                },
            };
        }
    }

    if (!accessToken) {
        store.dispatch(logout());
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        };
    }

    return {
        props: {},
    };
})

export { updateUserInfo, authorizeUser };