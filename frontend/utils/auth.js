import { wrapper } from "@/redux/store";
import UserService from "@/services/user.service";
import contestService from "@/services/contest.service";

import { logout, initUser } from "@/redux/reducers/user.reducer";

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
        props: {

        },
    };
})

const authorizeUser = wrapper.getServerSideProps((store) => async ({ req }) => {
    let accessToken = req.cookies["access_token"];

    if (accessToken && !store.getState().user.id) {
        try {
            const userInfo = await UserService.validateToken(accessToken);

            if (!userInfo.id) {
                console.error('Token validation failed');
                store.dispatch(logout());
                return {
                    redirect: {
                        destination: '/',
                        permanent: false,
                    },
                };
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

const authorizeAdmin = wrapper.getServerSideProps((store) => async ({ req }) => {
    let accessToken = req.cookies["access_token"];

    if (accessToken && !store.getState().user.id) {
        try {
            const userInfo = await UserService.validateToken(accessToken);

            if (!userInfo.id) {
                console.error('Token validation failed');
                store.dispatch(logout());
                return {
                    redirect: {
                        destination: '/',
                        permanent: false,
                    },
                };
            } else {
                store.dispatch(initUser(userInfo));
                if (userInfo.role !== 'admin') {
                    return {
                        redirect: {
                            destination: '/',
                            permanent: false,
                        },
                    };
                }
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
        props: {
            accessToken
        },
    };
})

const isOngoingContest = wrapper.getServerSideProps((store) => async ({ req, query }) => {
    let accessToken = req.cookies["access_token"];

    if (accessToken && !store.getState().user.id) {
        try {
            const userInfo = await UserService.validateToken(accessToken);

            if (!userInfo.id) {
                console.error('Token validation failed');
                store.dispatch(logout());
                return {
                    redirect: {
                        destination: '/',
                        permanent: false,
                    },
                };
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

    const { contestId } = query;
    let ongoingContest = null;
    try {
        const res = await contestService.getContestById(contestId);
        const now = new Date();
        const end_time = new Date(res.contest.end_time)
        if (now > end_time) {
            ongoingContest = false;
        }
        else {
            ongoingContest = true;
        }
    }
    catch (e) {
        console.log("Get contest failed with error", e);
    }
    return {
        props: {
            ongoingContest
        },
    };
})

export { updateUserInfo, authorizeUser, authorizeAdmin, isOngoingContest };