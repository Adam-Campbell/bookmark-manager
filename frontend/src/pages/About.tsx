import CollectionsBookmarkIcon from "@mui/icons-material/CollectionsBookmark";
import {
    Box,
    Container,
    Typography,
    Paper,
    Grid,
    Button,
    type Theme,
} from "@mui/material";
import { Link as RouterLink } from "react-router";

import TagIcon from "@mui/icons-material/Tag";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import DevicesIcon from "@mui/icons-material/Devices";

type FeatureCardProps = {
    Icon: React.ElementType;
    title: string;
    content: string;
};

function FeatureCard({ Icon, title, content }: FeatureCardProps) {
    return (
        <Paper
            variant="outlined"
            sx={{
                p: 2,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
                flexGrow: 1,
            }}
        >
            <Icon
                sx={(theme: Theme) => ({
                    fontSize: theme.typography.h3.fontSize,
                    color: theme.palette.secondary.main,
                    mb: 2,
                })}
            />
            <Typography variant="subtitle1" component="h2" gutterBottom>
                {title}
            </Typography>
            <Typography variant="body2">{content}</Typography>
        </Paper>
    );
}

export default function AboutPage() {
    return (
        <Box
            sx={{
                pt: 6,
                pb: { xs: 10, tablet: 4 },
            }}
        >
            <Container
                maxWidth="md"
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    textAlign: "center",
                }}
            >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                    <CollectionsBookmarkIcon
                        sx={(theme) => ({
                            fontSize: {
                                xs: theme.typography.h2.fontSize,
                                sm: theme.typography.h1.fontSize,
                            },
                            color: theme.palette.primary.main,
                        })}
                    />
                    <Typography
                        variant="h1"
                        sx={(theme) => ({
                            fontSize: {
                                xs: theme.typography.h2.fontSize,
                                sm: theme.typography.h1.fontSize,
                            },
                            ml: 1,
                        })}
                    >
                        Shelf
                    </Typography>
                </Box>
                <Typography variant="subtitle1">
                    Take{" "}
                    <Box
                        component="span"
                        sx={{
                            color: (theme) => theme.palette.primary.main,
                            fontStyle: "italic",
                        }}
                    >
                        control
                    </Box>{" "}
                    of your bookmarks
                </Typography>
                <Typography variant="body1" sx={{ mt: 4, mb: 2 }}>
                    Shelf is a feature-rich bookmark manager that allows you to
                    organise things your way, and find what you're looking for
                    with ease.
                </Typography>
                <Button
                    component={RouterLink}
                    to="/sign-up"
                    variant="contained"
                    color="primary"
                >
                    Sign Up to Get Started
                </Button>
            </Container>
            <Container maxWidth="lg" sx={{ mt: 4 }}>
                <Grid container spacing={2}>
                    <Grid display="flex" size={{ xs: 12, sm: 6, md: 4 }}>
                        <FeatureCard
                            Icon={TagIcon}
                            title="Tag and Search"
                            content="Organise your bookmarks with tags, and quickly
                                find bookmarks using tag filters and fuzzy
                                search."
                        />
                    </Grid>
                    <Grid display="flex" size={{ xs: 12, sm: 6, md: 4 }}>
                        <FeatureCard
                            Icon={PlaylistAddIcon}
                            title="Collections"
                            content="Group bookmarks into ordered lists, even if they have different tags."
                        />
                    </Grid>
                    <Grid display="flex" size={{ xs: 12, md: 4 }}>
                        <FeatureCard
                            Icon={DevicesIcon}
                            title="Cross-device Access"
                            content="Your bookmarks are tied to your account, and follow you wherever you go."
                        />
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}
