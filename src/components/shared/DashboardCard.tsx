import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface IProps {
  cardTitle: string;
  cardContent: string;
}
function DashboardCard({ cardContent, cardTitle }: IProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{cardTitle}</CardTitle>
      </CardHeader>
      <CardContent>{cardContent}</CardContent>
    </Card>
  );
}

export default DashboardCard;
