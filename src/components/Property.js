import React from "react";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

const Property = ({ name, value }) => {
  return (
    <>
      <Grid item xs={4}>
        <Typography
          variant="caption"
          color="textSecondary"
          align="left"
          component="p"
        >
          {name}
        </Typography>
      </Grid>
      <Grid item xs={8}>
        <Typography
          variant={"body2"}
          color={"textPrimary"}
          component="p"
          align="left"
        >
          {value}
        </Typography>
      </Grid>
    </>
  );
};

export default Property;
